require 'digest'

class Api::V1::LinksController < ApplicationController
    before_action :check_login, only: [:create, :show, :index]

    def short_url_redirect
        # Get short URL from params

        # Check cache for a matching entry
        cached_link = REDIS.get(access_link_params[:short_url])

        if cached_link
            cached_link = JSON.parse(cached_link)
            puts cached_link

            if cached_link[:expiry] && cached_link[:expiry] < Time.now
                REDIS.del(access_link_params[:short_url])

                # Lazily delete the link from db
                Link.delay.delete_all({ :short_url => cached_link['short_url'] })
                
                head :not_found
            else
                # Lazily update the access count using delayed_job gem
                Link.delay.find_one_and_update({ "$inc" => { access_count: 1 }, "$set" => { last_access_date: Time.now }})

                # Redirect to cached url
                redirect_to cached_link['long_url']
            end
        else
            link = Link.find_by(short_url: access_link_params[:short_url])

            # Match, so check if expired, then update usage stats, and redirect
            if link
                # If link has expired return 404
                head :not_found && link.delete if link.expired?

                # Lazily update the access count using delayed_job gem
                Link.delay.find_one_and_update({ "$inc" => { access_count: 1 }, "$set" => { last_access_date: Time.now }})

                # Set the link object in the cache with expiry of 1 day
                REDIS.set(access_link_params[:short_url], link.to_json, ex: 86400)

                # Redirect to the original url
                redirect_to link.long_url
            else
                # Link not in database so return 404
                head :not_found
            end
        end
    end

    # GET /api/v1/links
    # Params ?limit=10&offset=10
    def index
        limit = params[:limit] || 10
        offset = params[:offset] || 0

        # Retrieve all links that belong to user
        # Use skip and offset for pagination
        user_links = @current_user.links.skip(offset.to_i).limit(limit.to_i)

        render json: { links: user_links }
    end

    def show    
        # Check the database for the Link
        link = Links.find_by(short_url: params[:id])

        if link
            render json: link, status: :ok
        else
            head :not_found
        end
    end


    # POST /api/v1/links
    # Create a link based on the provided params
    def create
        # Get long URL from params
        if create_link_params[:url]
            @long_url = create_link_params[:url]

            # Check if valid link
            if !valid_url?(@long_url)
                render json: { 'error': 'Invalid url' }, status: :bad_request
            end
        else
            render json: { 'error': 'Please provide a url to shorten' }, status: :bad_request
        end

        @expiry = create_link_params[:expiry] || nil

        # Generate short url
        short_url = generate_short_url(create_link_params[:url])
        link = Link.create(short_url: short_url, long_url: create_link_params[:url], user: @current_user, expiry: @expiry)
        render json: link, status: :ok
    end

    private

    # Basic validation of url
    # Returns boolean 
    def valid_url?(url)
        # Parse url using built in URI 
        uri = URI.parse(url)

        # Check that url is a HTTP URI and has a non-nil host
        uri.is_a?(URI::HTTP) && !uri.host.nil?
        rescue
            # Return false on exception
            false
    end

    def generate_short_url(url)
        # Generate MD5 hash of URL to get a 128 bit hash value
        # Then Base64 encode and take the first 6 letters. This gives us
        # approximately 64^6 = ~68.7 billion possible short urls
        # There will be some collisions since we are taking first 6 letters
        # but this is unlikely

        # Generate random salt
        salt = SecureRandom.hex(12)

        # Calculate MD5 hash of url and salt
        md5_hash = Digest::MD5.hexdigest(url + salt.to_s)

        # Base64 encode 
        base64 = Base64.encode64(md5_hash)

        # Take first 6 chars as short url
        short_url = base64[0..5]
        
        return short_url
    end

    def create_link_params
        params.require(:link).permit(:url, :expiry)
    end

    def access_link_params
        params.permit(:short_url)
    end
end

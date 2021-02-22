require 'digest'

class Api::V1::LinksController < ApplicationController
    before_action :check_login, only: [:create, :show, :index, :destroy]

    # GET /:short_url
    # Redirect the user to the short URL with the provided id
    def short_url_redirect
        # Get short URL from params

        # Check cache for a matching entry
        cached_link = REDIS.get(access_link_params[:short_url])

        if cached_link
            cached_link = JSON.parse(cached_link)
            puts cached_link

            if cached_link[:expiry] && cached_link[:expiry] < Date.today
                REDIS.del(access_link_params[:short_url])

                # Lazily delete the link from db
                Delayed::Job.enqueue(DeleteLinkJob.new(access_link_params[:short_url]))
                
                head :not_found
            else
                # Lazily update the access count using delayed_job
                Delayed::Job.enqueue(UpdateLinkAccessJob.new(access_link_params[:short_url]))

                # Redirect to cached url
                redirect_to cached_link['long_url']
            end
        else
            link = Link.find_by(short_url: access_link_params[:short_url])

            # Match, so check if expired, then update usage stats, and redirect
            if link

                if link.expired?
                    # Lazily delete the link from db
                    Delayed::Job.enqueue(DeleteLinkJob.new(access_link_params[:short_url]))
                    head :not_found
                end

                # Lazily update the access count using delayed_job
                Delayed::Job.enqueue(UpdateLinkAccessJob.new(access_link_params[:short_url]))

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
    # Params: limit, offset
    # Return a list of the links that belong to the current user
    def index
        limit = params[:limit] || 10
        offset = params[:offset] || 0

        # Retrieve all links that belong to user
        # Use skip and offset for pagination
        user_links = @current_user.links.order_by(:_id.desc).skip(offset.to_i).limit(limit.to_i)

        render json: { link_count: user_links.count, links: user_links }
    end

    # GET /api/v1/links/:id
    # Return link document if it exists
    def show    
        # Check the database for the Link
        link = Links.find_by(short_url: params[:id])

        if link
            render json: link, status: :ok
        else
            head :not_found
        end
    end

    # DELETE /api/v1/links/:id
    # Delete the link document if it exists
    def destroy
        link = Link.find_by(short_url: params[:id])

        if link && link.remove
            # Successful delete response
            head :no_content
        else
            # Delete error response
            render json: { 'error': 'The link does not exist'}, status: :not_found
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

        retry_count = 0

        loop do
            # Generate short url
            short_url = generate_short_url(create_link_params[:url])

            # Create short url document
            link = Link.new(short_url: short_url, long_url: create_link_params[:url], user: @current_user, expiry: @expiry)

            # Retry if the link does not save
            if link.save
                render json: link, status: :ok
                break
            elsif retry_count == 3
                # Only retry 3 times
                render json: { 'error': 'Failed to create short link' }, status: :bad_request
                break
            end

            # Increase retry count
            retry_count += 1
        end
    end

    private 

    # Basic validation of url
    # Returns boolean 
    def valid_url?(url)
        # Parse url using built in URI 
        uri = URI.parse(url)

        # Check that url is a HTTP URI and has a non-nil host
        uri.is_a?(URI::HTTP) && !uri.host.nil? rescue false
    end


    # Generate MD5 hash of URL to get a 128 bit hash value
        # Then Base64 encode and take the first 6 letters. This gives us
        # approximately 64^6 = ~68.7 billion possible short urls
        # There will be some collisions since we are taking first 6 letters
        # but this is unlikely
    def generate_short_url(url)

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

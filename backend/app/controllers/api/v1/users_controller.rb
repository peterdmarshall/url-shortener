class Api::V1::UsersController < ApplicationController
    before_action :check_login

    # GET /api/v1/user
    # Returns the user object for current_user
    def show
        # Will only reach this method if current_user is defined
        render json: { user: @current_user }
    end

    # GET /api/v1/user/api_key
    # Returns the users API key if it exists
    def show_api_key
        if @current_user.api_key != nil
            # If the user already has an api key, return it
            render json: { api_key: @current_user.api_key }, status: :ok
        else
            head :not_found
        end
    end

    # POST /api/v1/user/api_key
    # Generates API key for user, overwrites existing
    def create_api_key
        loop do
            # Generate a random api key
            @unique_api_key = SecureRandom.hex(12)

            begin
                # Check if the generated api key belongs to another User
                User.find_by(api_key: @unique_api_key)
            rescue Mongoid::Errors::DocumentNotFound
                # Break from loop if the api key doesn't already belong to another User
                break
            end
        end
        
        if @current_user.update(api_key: @unique_api_key)
            render json: { api_key: @current_user.api_key }
        else
            render json: { error: 'Failed to generate api_key for user' }
        end
    end

    # DELETE /api/v1/user/links
    # Deletes all links for the current user
    def destroy_links
        user_links = @current_user.links
        user_links.each do |link|
            # Queue a job to delete each link
            Delayed::Job.enqueue(DeleteLinkJob.new(link.short_url))
        end

        # Indicate that the deletion has been queued
        head :accepted
    end

    # DELETE /api/v1/user
    # Deletes the current user data
    def destroy
        user = @current_user
        if user.destroy
            head :no_content
        else
            head :bad_request
        end
    end
end

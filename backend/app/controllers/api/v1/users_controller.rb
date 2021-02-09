class Api::V1::UsersController < ApplicationController
    before_action :check_login

    # GET /api/v1/user
    # Returns the user object for current_user
    def show
        # Will only reach this method if current_user is defined
        render json: { user: @current_user }
    end

    # GET /api/v1/users/api_key
    # Returns the users API key, generates one if it does not exist
    def api_key

        if @current_user.api_key != nil
            # If the user already has an api key, return it
            render json: { api_key: @current_user.api_key }, status: :ok
        else
            # If the user doesn't have an api key, generate one and return it

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
    end
end

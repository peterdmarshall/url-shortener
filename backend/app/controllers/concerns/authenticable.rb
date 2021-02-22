module Authenticable

    # Set the current user based on Authorization header
    def current_user
        return @current_user if @current_user

        # Check that authorization headers exist
        token = request.headers['Authorization']
        return nil if token.nil?

        if token.split(' ')[0] == 'Bearer'
            # Decode the authorization headers 
            decoded = AuthorizationService.new(request.headers).authenticate_request!
            
            # Get the auth0 uid from the decoded headers
            auth0_uid = decoded[0]["sub"]

            # Find or create user with the auth0 uid
            @current_user = User.find_or_create_by(auth0_uid: auth0_uid)
        else
            if token == ENV['MASTER_API_KEY']
                @current_user = User.find_or_create_by(api_key: token)
            else
                @current_user = User.find_by(api_key: token)
            end
        end
        

        rescue JWT::DecodeError
            render json: { error: "A token must be passed." }, status: :forbidden
        rescue JWT::ExpiredSignature
            render json: { error: "The token has expired." }, status: :forbidden
        rescue JWT::InvalidIssuerError
            render json: { error: "The token does not have a valid issuer." }, status: :forbidden
        rescue JWT::InvalidIatError
            render json: { error: "The token does not have a valid 'issue at' time." }, status: :forbidden
    end

    protected

    # Checks if the auth header has a valid auth0 token
    def check_login
        head :forbidden unless self.current_user
    end

    # Checks if the auth header has a valid api key
    def check_api_key
        # Return 403 Forbidden if there is no api key in the request headers
        head :forbidden unless self.current_api_key
    end
end
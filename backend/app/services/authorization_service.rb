class AuthorizationService

    # Set the headers instance variable
    def initialize(headers = {})
        @headers = headers
    end

    # Call verify token and throw an error if unsuccessful
    def authenticate_request!
        verify_token
    end

    private

    def http_token
        if @headers['Authorization'].present?
            # Get the auth token from the Authorization header
            @headers['Authorization'].split(' ').last
        end
    end

    def verify_token
        # Verify that the http_token is a valid auth0 token
        JsonWebToken.verify(http_token)
    end
end
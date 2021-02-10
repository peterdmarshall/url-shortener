# app/lib/json_web_token.rb
require 'net/http'
require 'uri'

class JsonWebToken
    def self.verify(token)
        # Decode the JWT token using the JWKS
        decoded = JWT.decode(token, nil,
                    true, # Verify the signature of this token
                    algorithm: 'RS256',
                    iss: ENV['AUTH0_DOMAIN'],
                    verify_iss: true,
                    aud: ENV['AUTH0_API_IDENTIFIER'],
                    verify_aud: true) do |header|
            jwks_hash[header['kid']]
        end
    end

    # Get the JSON Web Key Set (JWKS) from the endpoint provided by auth0
    def self.jwks_hash
        jwks_raw = Net::HTTP.get URI("#{ENV['AUTH0_DOMAIN']}.well-known/jwks.json")
        jwks_keys = Array(JSON.parse(jwks_raw)['keys'])
        hash = Hash[
            jwks_keys
            .map do |k|
                [
                    k['kid'],
                    OpenSSL::X509::Certificate.new(
                    Base64.decode64(k['x5c'].first)
                    ).public_key
                ]
            end
        ]
    end
end
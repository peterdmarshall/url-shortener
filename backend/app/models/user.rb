class User
  include Mongoid::Document
  include Mongoid::Alize

  field :auth0_uid, type: String
  field :api_key, type: String

  # Links belong to an api key rather than a user
  has_many :links, dependent: :destroy

  # Use mongoid alize to denormalize links
  alize :links
end

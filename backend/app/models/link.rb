class Link
  include Mongoid::Document
  include Mongoid::Alize

  field :short_url, type: String
  field :long_url, type: String
  field :expiry, type: DateTime

  # Store number of times a link has been accessed for analytics
  field :access_count, type: Integer, default: 0
  field :last_access_date, type: DateTime

  belongs_to :user, index: true

  # Index Links on their short_url
  index({ short_url: 1}, { unique: true })

  # Helper method to check expiry of link
  def expired?
    if expiry
      return expiry < Date.today
    else
      return false
    end
  end
end

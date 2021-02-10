class UpdateLinkAccessJob < Struct.new(:short_url)
    def perform
        link = Link.find_by(short_url: short_url)
        link.inc(access_count: 1)
        link.set(last_access_date: Time.now)
        link.save
    end
end
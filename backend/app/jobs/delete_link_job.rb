class DeleteLinkJob < Struct.new(:short_url)
    def perform
        link = Link.find_by(short_url: short_url)
        link.remove
    end
end
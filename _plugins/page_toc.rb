# _plugins/page_toc.rb

require 'nokogiri'

module Jekyll
  module TOCHelper
    def self.generate(html)
      doc = Nokogiri::HTML::DocumentFragment.parse(html)

      toc = +"<ul>\n"

      doc.css('h1, h2, h3').each do |h|
        id = h['id']
        next unless id

        toc << %(<li class="#{h.name}">)
        toc << %(<a href="##{id}">#{h.text}</a>)
        toc << "</li>\n"
      end

      toc << "</ul>\n"
      toc
    end
  end
end

Jekyll::Hooks.register [:pages, :documents], :post_render do |page|
  page.data['toc'] = Jekyll::TOCHelper.generate(page.output)
end

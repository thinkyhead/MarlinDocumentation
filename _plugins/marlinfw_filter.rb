module Jekyll
  module MarlinSiteFilter
    def linkify(input)
      re1 = /([GM])(\d)\b/
      re2 = /([GM])(\d\d)\b/
      input.upcase.gsub(re1, '\100\2').gsub(re2, '\10\2').gsub(/G00[01]/, 'G000-G001').gsub(/G00[23]/, 'G002-G003').gsub(/G01[7-9]/, 'G017-G019').gsub(/G05[4-9]/, 'G054-G059').gsub(/M00[01]/, 'M000-M001').gsub(/M00[7-9]/, 'M007-M009').gsub(/M084/, 'M018').gsub(/M81\d/, 'M810-M819').gsub(/M86\d/, 'M860-M869').gsub(/\.\d/, '')
    end

    def codes_desc(input)
      if input != nil
        out = input[0]
        if input.size > 1
          re1 = /([GM])(\d+).*$/
          doc1 = out.gsub(re1, '\2')
          doc2 = input.last.gsub(re1, '\2')
          out += doc2.to_i - doc1.to_i < 10 ? '-' : ', '
          out += input.last
        end
        out
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::MarlinSiteFilter)

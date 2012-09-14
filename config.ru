require 'sinatra/base'

# this is a simple static file server which serves up symbiote itself
# plus some fake responses to API calls. 
#
# The point of this is to be able to test symbiote changes without having to launch it embedded
# in a native iOS app.
#
# ALL OF THE BELOW WAS STOLEN FROM OCTOPRESS'S static server 
#


# The project root directory
$root = ::File.dirname(__FILE__)

class SinatraStaticServer < Sinatra::Base  

  get(/.+/) do
    case request.path
    when "/orientation"
      %Q|{"orientation":"portrait","detailed_orientation":"portrait"}|
    when "/screenshot"
      send_file( File.expand_path( "../fake_server/fake_screenshot", __FILE__ ) )
    when %r|^/screenshot/view-snapshot/|
      uid = request.path.split("/").last
      puts 'LOADING ' + uid
      send_file( File.expand_path( "../fake_server/fake_view_snapshots/#{uid}", __FILE__ ) )
    when "/screenshot/snapshot-all-views"
      "faked out"
    else
      send_sinatra_file(request.path) {404}
    end
  end

  post("/dump") do
    send_file( File.expand_path( "../fake_server/fake_dump_response.json", __FILE__ ) )
  end

  not_found do
    send_sinatra_file('404.html') {"Sorry, I cannot find #{request.path}"}
  end

  def send_sinatra_file(path, &missing_file_block)
    file_path = File.join(File.dirname(__FILE__), 'bundle',  path)
    file_path = File.join(file_path, 'index.html') unless file_path =~ /\.[a-z]+$/i  
    File.exist?(file_path) ? send_file(file_path) : missing_file_block.call
  end

end

run SinatraStaticServer

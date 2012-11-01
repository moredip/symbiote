guard 'coffeescript', :input => 'bundle'

guard 'haml', :input => 'bundle', :output => 'bundle' do
  watch(/^.+(\.html\.haml)/)
end

guard 'sass',
  :input => 'bundle/stylesheets/sass',
  :output => 'bundle/stylesheets/css',
  :smart_partials => true,
  :load_paths => ['bundle/stylesheets/sass'],
  :style => :compressed

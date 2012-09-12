Symbiote
========

Symbiote is a web-based tool for inspecting the state of your native iOS application. It is part of [Frank](http://www.testingwithfrank.com), and needs a Frank server to be embedded within your iOS app. 

## Hacking on Symbiote

This repo includes a little fake symbiote server. This means that you don't have to always run Symbiote embedded inside a native app. If you're just hacking on UI stuff you can stand up the fake symbiote server and go from there. 

To run the fake server:
```
gem install rack
rackup
open http://localhost:9292
````


## TODO

- Highlighting views that match selector
- Mouse over ersatz to highlight view in hierarchy
- better layout in landscape
- history of selectors

###License

Copyright 2012 ThoughtWorks, Inc. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

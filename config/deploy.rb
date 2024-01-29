require 'mina/deploy'
require 'mina/multistage'
require 'mina/git'

set :keep_releases, 3
set :shared_dirs, fetch(:shared_dirs, []).push('node_modules')
set :shared_files, fetch(:shared_files, []).push('/src/config.ts')
set :port, '22'     # SSH port number.
set :forward_agent, true     # SSH forward_agent.
set :stages, %w(staging production)
set :default_stage, 'staging'

task :setup => :remote_environment do
 if repository
   repo_host = repository.split(%r{@|://}).last.split(%r{:|\/}).first
   repo_port = /:([0-9]+)/.match(repository) && /:([0-9]+)/.match(repository)[1] || '22'

   command %(
     if ! ssh-keygen -H  -F #{repo_host} &>/dev/null; then
       ssh-keyscan -t rsa -p #{repo_port} -H #{repo_host} >> ~/.ssh/known_hosts
     fi
   )
 end
end

desc "Deploys the current version to the server."
task :deploy do
  invoke :'git:ensure_pushed'
  deploy do
    # Put things that will set up an empty directory into a fully set-up
    # instance of your project.
    invoke :'git:clone'
    invoke :'deploy:link_shared_paths'
    command %(source ~/.nvm/nvm.sh && nvm use)
    desc "path #{fetch(:stages_dir)}"

    command %( npm i && npm run build)
   
    #back to project directory
    # command %(cd ./..)
    
    # command %(touch "#{fetch(:shared_path)}/view/dist/robots.txt")
    # command %(echo "-----> Be sure to edit '#{fetch(:shared_path)}/view/dist/robots.txt'.")
    invoke :'deploy:cleanup'

    on :launch do
      in_path(fetch(:current_path)) do
        command %(~/bin/mailer_#{fetch(:stage)}.sh restart)
      end
    end
  end
end

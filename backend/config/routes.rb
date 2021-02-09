Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get '/:short_url', to: 'api/v1/links#short_url_redirect'
  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :links, only: [:index, :show, :create, :delete]
      get '/user', to: 'users#show'
      get '/user/api_key', to: 'users#api_key'
    end
  end
end

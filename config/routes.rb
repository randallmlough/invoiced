Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api, defaults: { format: :json } do
    # todo: add controllers
    resource :auth, only: [:register, :authenticate] do
      post :register
      post :authenticate
    end

    resources :users, only: [:index]
  end

  get '*path', to: "application#react_index", constraints: ->(request) do
    !request.xhr? && request.format.html?
  end
end
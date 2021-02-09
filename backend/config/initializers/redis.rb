redis_host = ENV['REDIS_HOST'] || 'localhost'
redis_port = ENV['REDIS_PORT'] || 6379

REDIS = Redis.new(host: redis_host, port: redis_port.to_i, db: 0)
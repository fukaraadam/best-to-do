setupNode() {
  echo "Setting up Node.js..."
  curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh
  sudo bash /tmp/nodesource_setup.sh
  sudo apt-get install -y nodejs
  echo "Node.js setup complete."
  npm install -g pm2
}

setupNginx() {
  # sudo apt install nginx
  # sudo ufw allow "Nginx Full"
  sudo nano /etc/nginx/sites-available/cumulativerse.conf
  # Add cumulativerse.conf content
  sudo ln -s /etc/nginx/sites-available/cumulativerse.conf /etc/nginx/sites-enabled/
  # Verify syntax
  # sudo nginx -t
  sudo systemctl reload nginx.service
}

setupSsl() {
  # sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d demo.cumulativerse.com

  sudo nano /etc/nginx/sites-available/bupo.conf
  # Add bupo.conf content
  
  # Renew
  sudo certbot renew --dry-run
  
  # Verify syntax
  # sudo nginx -t
  sudo systemctl reload nginx.service

}

updateRepo() {
  cd ~/best-to-do
  git pull
  npm run build
  # pm2 start npm --name "best-to-do" -- start
  pm2 restart best-to-do
}

# Install git-lfs
# sudo apt-get install git-lfs

# setupNode
# setupNginx
# setupSsl



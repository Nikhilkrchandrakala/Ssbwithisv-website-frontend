#!/usr/bin/expect -f

set timeout 300
set password "Joint@3services"
set ip "88.222.214.155"
set user "root"
set local_path "build/"
set remote_path "/var/www/ssbwithisv/frontend/build"

# Ensure remote directory exists
spawn ssh -o StrictHostKeyChecking=no $user@$ip "mkdir -p /var/www/ssbwithisv/frontend"
expect {
    "*password:*" { send "$password\r" }
}
expect eof

# Upload build folder
spawn rsync -avz -e "ssh -o StrictHostKeyChecking=no" $local_path $user@$ip:$remote_path
expect {
    "*password:*" { send "$password\r" }
}
expect eof

# Restart Nginx
spawn ssh -o StrictHostKeyChecking=no $user@$ip "systemctl restart nginx"
expect {
    "*password:*" { send "$password\r" }
}
expect eof

puts "Deployment Complete!"

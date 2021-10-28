git pull &&
ng build --prod &&
cd www &&
zip -r signalled.zip ./ &&
az webapp deployment source config-zip --resource-group Signalled --name signalled-pwa --subscription 'heedx bizspark' --src signalled.zip &&
cd ../.. 
rm -rf www
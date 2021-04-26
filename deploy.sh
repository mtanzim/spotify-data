cp .env.production .env &&
npm run build &&
aws s3 cp public s3://spotify-top-svelte/ --recursive --exclude "*DS_Store*"
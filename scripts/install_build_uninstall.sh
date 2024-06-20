#!/bin/bash

# Set the base directory
BASE_DIR=$(pwd)
IGNORED_DIRS=("node_modules" "automation" "aws" "cognito_admin" "cognito_jwt_keys_downloader" "cognito_post_auth_trigger" "cognito_pre_auth_trigger" "cognito_resend_confirmation" "cognito_signup", "config")

# Check if parameter is passed
if [ "$1" != "--install" ] && [ "$1" != "--uninstall" ]&& [ "$1" != "--build" ]; then
  echo "Please pass a parameter telling me to install or uninstall"
  exit 1
fi

function uninstall {
  # Get the name of the application directory
  APP_NAME=$(basename "$1")

  if [ -d "$1/node_modules" ]; then
    rm -rf "$1/node_modules"
    echo "Removed node_modules for $APP_NAME"
  fi

  if [ -f "$1/pnpm-lock.yaml" ]; then
    rm -f "$1/pnpm-lock.yaml"
    echo "Removed pnpm-lock.yaml for $APP_NAME"
  fi

  if [ -d "$1/dist" ]; then
    rm -rf "$1/dist"
    echo "Removed build directory for $APP_NAME"
  fi
}

function install {
  # Get the name of the application directory
  APP_NAME=$(basename "$1")

  # Install the dependencies for the application
  (
    cd "$1"
     pnpm install
  )
  echo "Started npm install for $APP_NAME"
}

function build {
  # Get the name of the application directory
  APP_NAME=$(basename "$1")

  # Install the dependencies for the application
  (
    cd "$1" || exit
    nx run-many --target=build --all
  )
  echo "Started yarn build for $APP_NAME"
}

# Loop through the root and all subdirectories
for APP_DIR in "$BASE_DIR"/*/
do
  # Get the name of the application directory
  APP_NAME=$(basename "$APP_DIR")

  # Check if the application has a package.json file
  if [ -f "$APP_DIR/package.json" ]; then
    # Remove the node_modules directory and the package-lock.json file if they exist
    if [ "$1" = "--uninstall" ]; then
      uninstall "$APP_NAME"
    elif [ "$1" = "--build" ]; then
      build "$APP_NAME"
    else
      # Install the dependencies for the application
      echo "Installing dependencies for $APP_NAME"
      install "$APP_NAME"
    fi
  else
    echo "Skipping $APP_NAME: package.json file not found"
  fi
done

# Handle the root package.json file
if [ -f "$BASE_DIR/package.json" ]; then
  # Remove the node_modules directory and the package-lock.json file if they exist
  if [ "$1" = "--uninstall" ]; then
    uninstall "$BASE_DIR"
  else
    # Install the dependencies for the root
    install "$BASE_DIR"
  fi
else
  echo "Skipping root: package.json file not found"
fi

# Wait for all npm install processes to finish
# wait
echo "Done with the command!"
exit 0;

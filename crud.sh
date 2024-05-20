#!/bin/bash

echo "Creating new module..."

# Ensure the script runs with bash
if [ -z "$BASH_VERSION" ]; then
    echo "Please run this script with bash"
    exit 1
fi

# Check if the script received exactly one argument
if [ "$#" -ne 1 ]; then
  echo "Error: You must provide exactly one argument."
  exit 1
fi

# Validate the argument to ensure it is a string without special characters
if echo "$1" | grep -q '[^a-zA-Z0-9_ ]'; then
  echo "Error: The argument must be a string without special characters."
  exit 1
fi

# Convert the argument to lower case and replace spaces with underscores
arg_lower=$(echo "$1" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')

# Convert the argument to camel case (e.g., "bonus_hunt" becomes "BonusHunt")
arg_camel=$(echo "$arg_lower" | awk -F_ '{for (i=1; i<=NF; i++) { printf toupper(substr($i,1,1)) tolower(substr($i,2)) }}')

arg_kebab=arg_lower=$(echo "$1" | tr '[:upper:]' '[:lower:]' | tr ' ' '-')

# Create the new model file
cp ./src/models/boiler_plate.model.ts "./src/models/${arg_lower}.model.ts"
sed -i "" "s/boiler_plates/${arg_lower}s/g" "./src/models/${arg_lower}.model.ts"
sed -i "" "s/BoilerPlateModel/${arg_camel}Model/g" "./src/models/${arg_lower}.model.ts"

# Copy the boiler_plate directory to the new module directory
cp -r ./src/modules/boiler_plate "./src/modules/${arg_lower}"

# Rename the files in the new module directory
mv "./src/modules/${arg_lower}/boiler_plate.service.ts" "./src/modules/${arg_lower}/${arg_lower}.service.ts"
mv "./src/modules/${arg_lower}/boiler_plate.controller.ts" "./src/modules/${arg_lower}/${arg_lower}.controller.ts"
mv "./src/modules/${arg_lower}/boiler_plate.dto.ts" "./src/modules/${arg_lower}/${arg_lower}.dto.ts"
mv "./src/modules/${arg_lower}/boiler_plate.module.ts" "./src/modules/${arg_lower}/${arg_lower}.module.ts"

# Replace all occurrences of BoilerPlate, Boiler Plate, boiler_plate, and boiler_plates in the new module files
sed -i "" "s/BoilerPlate/${arg_camel}/g" ./src/modules/${arg_lower}/*
sed -i "" "s/Boiler Plate/${arg_camel}/g" ./src/modules/${arg_lower}/*
sed -i "" "s/boiler_plate/${arg_lower}/g" ./src/modules/${arg_lower}/*
sed -i "" "s/boiler_plates/${arg_lower}s/g" ./src/modules/${arg_lower}/*

# Update the app.module.ts file to include the new module import
# Find the line number of the last import statement
last_import_line=$(grep -n "^import " ./src/app.module.ts | tail -1 | cut -d: -f1)

# Insert the new import statement after the last import statement
sed -i "" "$last_import_line a\\
import { ${arg_camel}Module } from './modules/${arg_lower}/${arg_lower}.module';
" ./src/app.module.ts

# Insert the new module into the imports array above the IMPORTANT NOTE line
sed -i "" "/IMPORTANT NOTE: DO NOT REMOVE OR EDIT THIS ROW/i\\
    ${arg_camel}Module,
" ./src/app.module.ts

# Add the new export to the index.ts file in the models directory
echo "export * from './${arg_lower}.model';" >> ./src/models/index.ts

echo "Module ${arg_camel} has been created successfully."

echo "Creating migration file..."

yarn sequelize-cli migration:generate --name create-table-${arg_kebab}
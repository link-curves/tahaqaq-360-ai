#!/bin/bash
# ======================================
# NestJS Custom Module Generator Script
# ======================================
# Usage: ./nest-create-module.sh <module_name>
# Example: ./nest-create-module.sh submissions

set -e

if [ -z "$1" ]; then
  echo "❌ Error: Please provide a module name."
  echo "Usage: ./nest-create-module.sh <module_name>"
  exit 1
fi

MODULE_NAME=$(echo "$1" | tr '[:upper:]' '[:lower:]')
SINGULAR_NAME=$(echo "$MODULE_NAME" | sed 's/s$//')
MODULE_DIR="src/modules/$MODULE_NAME"

echo "🚀 Creating NestJS module: $MODULE_NAME ..."
mkdir -p "$MODULE_DIR"/{entities,dto}

# Create module file
cat > "$MODULE_DIR/$MODULE_NAME.module.ts" <<EOF
import { Module } from '@nestjs/common';
import { ${MODULE_NAME^}Service } from './${MODULE_NAME}.service';
import { ${MODULE_NAME^}Controller } from './${MODULE_NAME}.controller';

@Module({
  controllers: [${MODULE_NAME^}Controller],
  providers: [${MODULE_NAME^}Service],
})
export class ${MODULE_NAME^}Module {}
EOF

# Create service file
cat > "$MODULE_DIR/$MODULE_NAME.service.ts" <<EOF
import { Injectable } from '@nestjs/common';

@Injectable()
export class ${MODULE_NAME^}Service {
  // TODO: Implement ${MODULE_NAME} service logic
}
EOF

# Create controller file
cat > "$MODULE_DIR/$MODULE_NAME.controller.ts" <<EOF
import { Controller } from '@nestjs/common';
import { ${MODULE_NAME^}Service } from './${MODULE_NAME}.service';

@Controller('${MODULE_NAME}')
export class ${MODULE_NAME^}Controller {
  constructor(private readonly ${MODULE_NAME}Service: ${MODULE_NAME^}Service) {}
}
EOF

# Create entity file
cat > "$MODULE_DIR/entities/${SINGULAR_NAME}.entity.ts" <<EOF
export class ${SINGULAR_NAME^} {
  // TODO: Define ${SINGULAR_NAME} entity
}
EOF

# Create DTOs
cat > "$MODULE_DIR/dto/create-${SINGULAR_NAME}.dto.ts" <<EOF
export class Create${SINGULAR_NAME^}Dto {
  // TODO: Define create ${SINGULAR_NAME} DTO
}
EOF

cat > "$MODULE_DIR/dto/update-${SINGULAR_NAME}.dto.ts" <<EOF
export class Update${SINGULAR_NAME^}Dto {
  // TODO: Define update ${SINGULAR_NAME} DTO
}
EOF

cat > "$MODULE_DIR/dto/${SINGULAR_NAME}-response.dto.ts" <<EOF
export class ${SINGULAR_NAME^}ResponseDto {
  // TODO: Define response ${SINGULAR_NAME} DTO
}
EOF

echo "✅ Module '$MODULE_NAME' created successfully at $MODULE_DIR"

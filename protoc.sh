# Path to this plugin, Note this must be an absolute path on Windows (see #15)
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-grpc-ts"

# Directory to write generated code to (.js and .d.ts files)
OUT_DIR="./generated"

protoc \
-I=proto \
--plugin="protoc-gen-grpc-ts=${PROTOC_GEN_TS_PATH}" \
--js_out="import_style=commonjs,binary:${OUT_DIR}" \
--ts_out="service=grpc-web:${OUT_DIR}" \
proto/*.proto

# Remove Suffix <List> from repeated fields
grep -rl -e List generated | xargs -I {} perl -pi -e 's/(?<!Object)List//g' {}
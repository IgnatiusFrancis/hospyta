// index.ts
// Explicitly export members from each module
export {
  protobufPackage as authProtobufPackage,
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
} from './auth';
export {
  protobufPackage as postProtobufPackage,
  POST_PACKAGE_NAME,
  POST_SERVICE_NAME,
} from './post';
export {
  protobufPackage as commentProtobufPackage,
  COMMENT_PACKAGE_NAME,
  COMMENT_SERVICE_NAME,
} from './comment';

import { SetMetadata } from "@nestjs/common";

export const SKIP_VERSION_CHECK = 'skipVersionCheck';
export const SkipVersionCheck = () => SetMetadata(SKIP_VERSION_CHECK, true);

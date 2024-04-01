import { argv } from '@message-brokers-lab/env';

const entryFile = argv.file || 'guidance';

require(`./${entryFile}`);

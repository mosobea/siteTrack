import {Global, Module} from '@nestjs/common';
import {PrismaService} from './prisma.service';

// global module to use it in other modules without importing it
@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule {}


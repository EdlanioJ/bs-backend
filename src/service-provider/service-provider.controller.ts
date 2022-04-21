import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser } from '../auth/decorators/get-current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '../auth/entities/role.enum';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateServiceProviderBody } from './dto/create-provider.dto';
import { ServiceProviderService } from './service-provider.service';
import { AcceptConnectionService } from './services/accept-connection.service';
import { DeleteConnectionService } from './services/delete-connection.service';
import { ListConnectionByManagerService } from './services/list-connection-by-manager.service';
import { ListConnectionService } from './services/list-connection.service';
import { RejectConnectionService } from './services/reject-connection';
import { RequireConnectionService } from './services/require-connection.service';

@Controller('provider')
@UseGuards(JwtGuard)
export class ServiceProviderController {
  constructor(
    private readonly providerService: ServiceProviderService,
    private readonly rejectConnectionService: RejectConnectionService,
    private readonly listConnectionService: ListConnectionService,
    private readonly listConnectionByMAnagerService: ListConnectionByManagerService,
    private readonly acceptConnectionService: AcceptConnectionService,
    private readonly deleteConnectionService: DeleteConnectionService,
    private readonly requireConnectionService: RequireConnectionService,
  ) {}

  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() body: CreateServiceProviderBody,
    @GetCurrentUser('sub') userId: string,
  ) {
    return this.providerService.create({ name: body.name, userId });
  }

  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Post('connection/:userId/require')
  @HttpCode(HttpStatus.CREATED)
  requestConnection(
    @GetCurrentUser('sub') providerOwnerId: string,
    @Param('userId') userToConnectId: string,
  ) {
    return this.requireConnectionService.execute({
      providerOwnerId,
      userToConnectId,
    });
  }

  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Post('connection/:id/accept')
  @HttpCode(HttpStatus.CREATED)
  acceptConnection(
    @GetCurrentUser('sub') userId: string,
    @Param('id') connectionId: string,
  ) {
    return this.acceptConnectionService.execute({
      userId,
      connectionId,
    });
  }

  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Patch('connection/:id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  rejectConnection(
    @GetCurrentUser('sub') userId: string,
    @Param('id') connectionId: string,
  ) {
    return this.rejectConnectionService.execute({
      userId,
      connectionId,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') providerId: string) {
    return this.providerService.findOne(providerId);
  }

  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete('connection/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteConnection(
    @GetCurrentUser('sub') userId: string,
    @Param('id') connectionId: string,
  ) {
    return this.deleteConnectionService.execute({
      userId,
      connectionId,
    });
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Get('/connection')
  @HttpCode(HttpStatus.OK)
  listConnection(@Query('page') page: number, @Query('limit') limit: number) {
    return this.listConnectionService.execute({ page, limit });
  }

  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Get('connection/manager')
  @HttpCode(HttpStatus.OK)
  listConnectionByManager(
    @GetCurrentUser('sub') userId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.listConnectionByMAnagerService.execute({
      userId,
      limit,
      page,
    });
  }

  @Roles(Role.MANAGER)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @GetCurrentUser('sub') userId: string,
    @Param('id') providerId: string,
  ) {
    return this.providerService.delete({ providerId, userId });
  }
}

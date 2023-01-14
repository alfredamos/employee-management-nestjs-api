import { Reflector } from '@nestjs/core';
import { CanActivate, Injectable, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import {UserType} from "@prisma/client";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){}
    canActivate(context: ExecutionContext): boolean {
        const isPublic = this.reflector.getAllAndOverride('isPublic',[
            context.getHandler(),
            context.getClass()
        ]);

        if (isPublic) return true;

        const roles = this.reflector.get<string[]>('roles', context.getHandler());

        if(!roles) return false;

        const request = context.switchToHttp().getRequest();

        const user = request.user;

        console.log({user})

        if(!user) throw new UnauthorizedException('You are not authorized to access this resource.',);
    
        return this.matchRoles(roles, user?.userType)

  }

  matchRoles(roles: string[], userType: UserType){
    return roles.includes(userType);
  }
}

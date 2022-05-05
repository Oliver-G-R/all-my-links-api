import { Injectable } from '@nestjs/common';
import { SignUpDto } from './Dtos/signUp.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { SignInDto } from './Dtos/signIn.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  signIn({ email, password }: SignInDto) {
    return { email, password };
  }

  signUp(data: SignUpDto): Promise<User> {
    return this.userService.create(data);
  }
}

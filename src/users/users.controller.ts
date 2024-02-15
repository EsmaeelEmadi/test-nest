import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import * as multer from 'multer';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('upload-avatar')
  @UseInterceptors(FileInterceptor('avatar', {
    storage: multer.diskStorage({
      destination: './uploads', // Specify the directory to store the files
      filename: (req, file, callback) => {
        // Generate a unique filename for the uploaded file
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniqueSuffix}-${file.originalname}`;
        callback(null, filename);
      },
    }),
  }))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File, @Body() createUserDto: CreateUserDto) {
    // Handle the uploaded file and user data
    console.log(file); // For demonstration, shows the file info in the console
    // Here, you might save the file information in the database, along with user data
    return this.usersService.create({...createUserDto, avatar: file?.filename});
  }
}
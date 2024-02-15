import {  UseInterceptors, Res, Param, UploadedFile, Controller, Delete, Get, Post, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import * as multer from 'multer';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import { Response } from 'express';


@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
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


  @Get()
  async findAll(): Promise<UserDocument[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  async findUser(@Param('userId') userId: string) {
    return this.usersService.findUserById(userId);
  }

  @Get(':userId/avatar')
  async getAvatar(@Param('userId') userId: string, @Res() res: Response) {
    const { avatarPath } = await this.usersService.getUserAvatar(userId);
    res.sendFile(avatarPath);
  }

  @Delete(':userId/avatar')
  async deleteAvatar(@Param('userId') userId: string) {
    await this.usersService.deleteUserAvatar(userId);
    return { message: 'Avatar deleted successfully' };
  }
}




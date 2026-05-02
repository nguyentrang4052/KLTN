import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatHistoryService } from "./chat-history.service";
import { CreateSessionDto } from 'src/chatbot/chat-history/dto/create-session.dto';
import { SaveMessageDto } from 'src/chatbot/chat-history/dto/save-message.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RenameSessionDto } from './dto/rename-session.dto';
import { PinSessionDto } from './dto/pin-session.dto';

@Controller('chat-history')
export class ChatHistoryController {
    constructor(private chatHistoryService: ChatHistoryService) { }

    @Get('get-sessions')
    @UseGuards(JwtAuthGuard)
    getSessions(@Req() req: any) {
        return this.chatHistoryService.findSessionByUser(req.user?.sub);
    }

    @Post('create-sessions')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    createSession(@Req() req: any, @Body() dto: CreateSessionDto) {
        return this.chatHistoryService.createSession({ ...dto, userID: req.user?.sub });
    }

    @Get('sessions/:sessionID/messages')
    @UseGuards(JwtAuthGuard)
    getMessages(@Param('sessionID') sessionID: number) {
        return this.chatHistoryService.findMessagesBySession(sessionID);
    }

    @Post('save-messages')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    saveMessage(@Body() dto: SaveMessageDto) {
        return this.chatHistoryService.saveMessage(dto);
    }

    @Post('delete-session/:sessionID')
    @UseGuards(JwtAuthGuard)
    deleteSession(@Param('sessionID') sessionID: number) {
        return this.chatHistoryService.deleteSession(sessionID);
    }

    @Put('rename-session/:sessionID')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    renameSession(
        @Param('sessionID') sessionID: number,
        @Body() dto: RenameSessionDto,
        @Req() req: any
    ) {
        return this.chatHistoryService.renameSession(sessionID, dto.title, req.user?.sub);
    }


    @Put('pin-session/:sessionID')
    @UsePipes(new ValidationPipe({ whitelist: true }))
    @UseGuards(JwtAuthGuard)
    pinSession(
        @Param('sessionID') sessionID: number,
        @Body() dto: PinSessionDto,
        @Req() req: any
    ) {
        return this.chatHistoryService.pinSession(sessionID, dto.isPinned, req.user?.sub);
    }

}

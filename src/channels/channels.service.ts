import { Injectable, NotFoundException } from '@nestjs/common';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Workspaces } from 'src/entities/Workspaces';
import { ChannelChats } from 'src/entities/ChannelChats';
import { Users } from 'src/entities/Users';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(ChannelChats)
    private channelChatsRepository: Repository<ChannelChats>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findById(id: number) {
    return this.channelsRepository.findOne({ where: { id } });
  }

  async getWorkspaceChannels(url: string, myId: number) {
    return this.channelsRepository
      .createQueryBuilder('channels')
      .innerJoinAndSelect(
        'channels.ChannelMembers',
        'channelMembers',
        'channelMembers.userId=:myId',
        { myId },
      )
      .innerJoinAndSelect(
        'channels.Workspace',
        'workspace',
        'workspace.url=:url',
        { url },
      )
      .getMany();
  }

  async getWorkspaceChannel(url: string, name: string) {
    return this.channelsRepository.findOne({
      where: {
        name,
      },
      relations: ['Workspace'],
    });
  }

  async createWorkspaceChannels(url: string, name: string, myId: number) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
    });
    const channel = new Channels();
    channel.name = name;
    channel.WorkspaceId = workspace.id;
    const channelReturned = await this.channelsRepository.save(channel);
    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceChannelMembers(url: string, name: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.Channels', 'channels', 'channels.name=:name', { name })
      .innerJoin('channels.Workspace', 'workspace', 'workspace.url=:url', {
        url,
      })
      .getMany();
  }

  async createWorkspaceChannelMembers(url, name, email) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url=:url', {
        url,
      })
      .where('channel.name=:name', { name })
      .getOne();
    if (!channel) {
      // return null; // TODO : 이 때 어떻게 에러 발생?
      throw new NotFoundException('채널이 존재하지 않습니다.'); // 404 Error
    }
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.email=:email', { email })
      .innerJoin('user.Workspaces', 'workspace', 'workspace.url=:url', { url })
      .getOne();
    if (!user) {
      throw new NotFoundException('사용자가 존재하지 않습니다.');
    }
    const channelMember = new ChannelMembers();
    channelMember.ChannelId = channel.id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceChannelChats(
    url: string,
    name: string,
    perPage: number,
    page: number,
  ) {
    // 여기서 'name'과 'url'은 많이 사용되기 때문에 index걸어주기
    return this.channelChatsRepository
      .createQueryBuilder('channelChats')
      .innerJoin('channelChats.Channel', 'channel', 'channel.name=:name', {
        name,
      })
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url=:url', {
        url,
      })
      .innerJoinAndSelect('channelChats.User', 'user')
      .orderBy('channelChats.createdAt', 'DESC') // 날짜 역순으로 정렬
      .take(perPage) // sql에서 limit을 뜻한다.
      .skip(perPage * (page - 1)) // 페이지네이션
      .getMany();
  }

  async getChannelUnreadsCount(url, name, after) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url=:url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
    return this.channelChatsRepository.count({
      // sql의 COUNT(*)와 동일하다.
      where: {
        ChannelId: channel.id,
        createdAt: MoreThan(new Date(after)), // MoreThan 연산자 -> createdAt > "2021-08-16"
      },
    });
  }
  // 매개변수가 많아지면 순서가 헷갈리는데 이럴때는 {}로 객체처리 해주는것이 좋다.
  async postChat({ url, name, content, myId }) {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoin('channel.Workspace', 'workspace', 'workspace.url =:url', {
        url,
      })
      .where('channel.name = :name', { name })
      .getOne();
    if (!channel) {
      throw new NotFoundException('채널이 존재하지 않습니다.');
    }
    const chats = new ChannelChats();
    chats.content = content;
    chats.UserId = myId;
    chats.ChannelId = channel.id;
    const savedChat = await this.channelChatsRepository.save(chats);
    const chatWithUser = await this.channelChatsRepository.findOne({
      where: { id: savedChat.id },
      relations: ['User', 'Channel'],
    });
    // socket.io로 워크스페이스+채널 사용자한테 전송
  }
}

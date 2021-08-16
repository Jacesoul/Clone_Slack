import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository } from 'typeorm';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Channels } from 'src/entities/Channels';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Users } from 'src/entities/Users';
import { stringify } from 'querystring';
import { Channel } from 'diagnostics_channel';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(Workspaces)
    private workspaceRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  async findById(id: number) {
    // findById([id])는 findOne({where : {id}})와 동일하다.
    // find({where:{id}, take:1})과도 동일하다. 여기서 take는 limit이다. skip은 offset
    return this.workspaceRepository.findByIds([id]);
  }

  async findMyWorkspaces(myId: number) {
    return this.workspaceRepository.find({
      where: {
        WorkspaceMembers: [{ userId: myId }],
      },
    });
  }
  async createWorkspace(name: string, url: string, myId: number) {
    const workspace = this.workspaceRepository.create({
      name,
      url,
      OwnerId: myId,
    });
    const returned = await this.workspaceRepository.save(workspace);

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = myId;
    workspaceMember.WorkspaceId = returned.id;
    // await this.workspaceMembersRepository.save(workspaceMember);
    const channel = new Channels();
    channel.name = '일반';
    channel.WorkspaceId = returned.id;
    // const channelReturned = await this.channelsRepository.save(channel);
    const [, channelReturned] = await Promise.all([
      this.workspaceMembersRepository.save(workspaceMember),
      this.channelsRepository.save(channel),
    ]);

    const ChannelMember = new ChannelMembers();
    ChannelMember.UserId = myId;
    ChannelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(ChannelMember);
  }

  async getWorkspaceMembers(url: string) {
    this.usersRepository
      .createQueryBuilder('user') // user는 User Entity에 대한 별명
      .innerJoin('user.WorkspaceMembers', 'm') // members는 별명
      .innerJoin('m.Workspace', 'w', 'w.url = :url', { url: url }) // 마지막의 파라미터가 3번째의 :url에 쏙 들어간다. 파싱해서 넣어준다. 그냥 {url}로 줄여서 쓸수 있다.
      .getMany(); // getCount()는 갯수를 가져온다. getOneOrFail()은 가져오지 않으면 에러를 표시해준다.
    // getRawMany()는 SQL이 주는 방식대로 결과값이 나온다. (문자열로 결과값을 줌)
  }
}

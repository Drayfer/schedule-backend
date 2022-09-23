import { CreateNotificationDto } from './dto/create-notification.dto';
import { UserEntity } from './../user/entities/user.entity';
import { LessonEntity } from './../lesson/entities/lesson.entity';
import { StudentEntity } from './../student/entities/student.entity';
import { Repository, Between, Not } from 'typeorm';
import { OptionEntity } from './entities/option.entity';
import { Injectable } from '@nestjs/common';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(OptionEntity)
    private optionRepository: Repository<OptionEntity>,
    @InjectRepository(StudentEntity)
    private studentRepository: Repository<StudentEntity>,
    @InjectRepository(LessonEntity)
    private lessonRepository: Repository<LessonEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async findAll(id: number) {
    const options = await this.optionRepository.findOne({
      where: {
        userId: id,
      },
    });
    return options;
  }

  async update(id: number, dto: UpdateOptionDto) {
    await this.optionRepository.update(
      {
        userId: id,
      },
      {
        ...dto,
      },
    );
    return this.optionRepository.findOneBy({ userId: id });
  }

  async getSttistic(userId: number) {
    const students = await this.studentRepository.findAndCount({
      where: {
        userId,
        // delete: true,
      },
    });
    const deletedStudents = students[0].filter(
      (student) => student.delete,
    ).length;

    const stardDay = moment();
    const monthLessons = await this.lessonRepository.findAndCount({
      where: {
        userId,
        date: Between(
          stardDay.clone().subtract(1, 'months').startOf('day').toDate(),
          stardDay.startOf('day').toDate(),
        ),
        complete: true,
      },
    });
    const totalLessons = await this.lessonRepository.findAndCount({
      where: {
        userId,
        complete: true,
      },
    });

    const { rateWithBalance, rateWithoutBalance } =
      await this.optionRepository.findOneBy({ userId });

    // monthIncome
    const withBalanceMonth =
      monthLessons[0].filter(
        (lesson) =>
          students[0].find((student) => student.id === lesson.studentId)
            .showBalance,
      ).length * rateWithBalance;
    const withoutBalanceMonth =
      monthLessons[0].filter(
        (lesson) =>
          !students[0].find((student) => student.id === lesson.studentId)
            .showBalance,
      ).length * rateWithoutBalance;
    const monthIncome = withBalanceMonth + withoutBalanceMonth;

    // totalIncome
    const withBalanceTotal =
      totalLessons[0].filter(
        (lesson) =>
          students[0].find((student) => student.id === lesson.studentId)
            .showBalance,
      ).length * rateWithBalance;
    const withoutBalanceTotal =
      totalLessons[0].filter(
        (lesson) =>
          !students[0].find((student) => student.id === lesson.studentId)
            .showBalance,
      ).length * rateWithoutBalance;
    const totalIncome = withBalanceTotal + withoutBalanceTotal;

    // weekIncome
    const weekLessons = await this.lessonRepository.findAndCount({
      where: {
        userId,
        date: Between(
          stardDay.clone().subtract(1, 'weeks').startOf('day').toDate(),
          stardDay.startOf('day').toDate(),
        ),
        complete: true,
      },
    });
    const withBalanceWeek =
      weekLessons[0].filter(
        (lesson) =>
          students[0].find((student) => student.id === lesson.studentId)
            .showBalance,
      ).length * rateWithBalance;
    const withoutBalanceWeek =
      weekLessons[0].filter(
        (lesson) =>
          !students[0].find((student) => student.id === lesson.studentId)
            .showBalance,
      ).length * rateWithoutBalance;
    const weekIncome = withBalanceWeek + withoutBalanceWeek;

    return {
      deletedStudents: deletedStudents,
      monthLessons: monthLessons[1],
      totalLessons: totalLessons[1],
      monthIncome,
      totalIncome,
      weekIncome,
    };
  }

  async getChart(userId: number, utcMinutes: number) {
    let startWeek = moment
      .utc()
      .startOf('isoWeek')
      .subtract(utcMinutes, 'minutes')
      .add(1, 'week');

    const weeks = [];
    const { createdDate } = await this.userRepository.findOneBy({ id: userId });

    while (moment(createdDate).isBefore(startWeek)) {
      const weekLessons = await this.lessonRepository.findAndCount({
        where: {
          userId,
          date: Between(
            startWeek.clone().subtract(1, 'weeks').toDate(),
            startWeek.toDate(),
          ),
          complete: true,
        },
      });
      startWeek = startWeek.subtract(1, 'week');

      weeks.unshift({
        lessons: weekLessons[1],
        lessonsInfo: weekLessons[0],
        date: startWeek
          .clone()
          .add(utcMinutes, 'minutes')
          .format('DD.MM.YYYY')
          .toString(),
      });
    }

    const students = await this.studentRepository.find({
      where: {
        userId,
      },
    });
    const { rateWithBalance, rateWithoutBalance } =
      await this.optionRepository.findOneBy({ userId });

    // income every week
    const weekIncome = weeks.map((week) => {
      const withBalanceWeek =
        week.lessonsInfo?.filter(
          (lesson) =>
            students.find((student) => student.id === lesson.studentId)
              .showBalance,
        ).length * rateWithBalance;
      const withoutBalanceWeek =
        week.lessonsInfo?.filter(
          (lesson) =>
            !students.find((student) => student.id === lesson.studentId)
              .showBalance,
        ).length * rateWithoutBalance;
      return withBalanceWeek + withoutBalanceWeek;
    });

    //added students in every week
    const weekStudents = weeks.map((week) =>
      students
        .filter((student) =>
          moment(student.createdDate).isBetween(
            moment(week.date, 'DD.MM.YYYY'),
            moment(week.date, 'DD.MM.YYYY').add(1, 'weeks'),
          ),
        )
        .map(
          (student) =>
            `${student.name} ${student.surname}::${moment(
              student.createdDate,
            )}`,
        ),
    );

    return weeks.map((week, index) => ({
      date: week.date,
      lessons: week.lessons,
      weekIncome: weekIncome[index],
      weekStudents: weekStudents[index],
    }));
  }

  async createNotification(dto: CreateNotificationDto, userId: number) {
    const { notificationsArr } = await this.optionRepository.findOne({
      where: {
        userId,
      },
    });
    await this.optionRepository.update(
      { userId },
      {
        notificationsArr: [...notificationsArr, dto].sort((a, b) =>
          moment(b.date).isBefore(a.date) ? 1 : -1,
        ),
      },
    );
    const { notificationsArr: updatedNotifications } =
      await this.optionRepository.findOne({
        where: {
          userId,
        },
      });
    return updatedNotifications;
  }

  async removeNotification(noteId: number, userId: number) {
    const { notificationsArr } = await this.optionRepository.findOne({
      where: {
        userId,
      },
    });
    await this.optionRepository.update(
      { userId },
      {
        notificationsArr: notificationsArr.filter((note) => note.id !== noteId),
      },
    );
    return;
  }

  async editNotification(dto: CreateNotificationDto, userId: number) {
    const { notificationsArr } = await this.optionRepository.findOne({
      where: {
        userId,
      },
    });
    await this.optionRepository.update(
      { userId },
      {
        notificationsArr: notificationsArr
          .map((note) => (note.id !== dto.id ? note : dto))
          .sort((a, b) => (moment(b.date).isBefore(a.date) ? 1 : -1)),
      },
    );
    const { notificationsArr: updatedNotifications } =
      await this.optionRepository.findOne({
        where: {
          userId,
        },
      });
    return updatedNotifications;
  }

  async allCompleteNotifications(userId: number) {
    const { notificationsArr } = await this.optionRepository.findOne({
      where: {
        userId,
      },
    });
    await this.optionRepository.update(
      { userId },
      {
        notificationsArr: notificationsArr.filter(
          (note) => note.complete === false,
        ),
      },
    );
    const { notificationsArr: updatedArray } =
      await this.optionRepository.findOne({
        where: {
          userId,
        },
      });
    return updatedArray;
  }

  async setLocale(userId: number, localeLang: string) {
    await this.optionRepository.update({ userId }, { locale: localeLang });
    return localeLang;
  }

  async updateWebviewToken(webviewToken: string, userId: number) {
    await this.optionRepository.update({ userId }, { webviewToken });
  }

  @Cron('* * * * * *')
  async handleCron() {
    const optionInfo = await this.optionRepository.find({
      where: {
        webviewToken: Not(''),
      },
    });

    if (!optionInfo.length) return;

    const timeMoment = moment().utc();
    const notifMaxMinute = Math.max(
      ...optionInfo.map((item) => item.notifyMinutes),
    );
    const notifMinMinute = Math.min(
      ...optionInfo.map((item) => item.notifyMinutes),
    );

    const lessons = await this.lessonRepository.find({
      where: {
        date: Between(
          timeMoment.clone().add(notifMinMinute, 'minutes').toDate(),
          timeMoment
            .clone()
            .add(notifMaxMinute + 1, 'minutes')
            .toDate(),
        ),
        complete: false,
      },
    });

    await lessons.forEach(async (lesson) => {
      await optionInfo.forEach(async (item) => {
        if (
          moment(lesson.date)
            .utc()
            .isBetween(
              timeMoment.clone().add(item.notifyMinutes - 1, 'minutes'),
              timeMoment.clone().add(item.notifyMinutes + 1, 'minutes'),
            )
        ) {
          const { name, surname } = await this.studentRepository.findOne({
            where: {
              id: lesson.studentId,
            },
          });
          if (lesson.userId === item.userId) {
            this.sentNotification(
              item.webviewToken,
              `Lesson - ${name} ${surname}`,
              `After ${item.notifyMinutes} minutes`,
            );
          }
        }
      });
    });
    return;
  }

  async sentNotification(to: string, title: string, body: string) {
    try {
      await axios({
        url: 'https://exp.host/--/api/v2/push/send',
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        data: {
          to,
          title,
          body,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}

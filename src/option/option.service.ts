import { CreateNotificationDto } from './dto/create-notification.dto';
import { UserEntity } from './../user/entities/user.entity';
import { LessonEntity } from './../lesson/entities/lesson.entity';
import { StudentEntity } from './../student/entities/student.entity';
import { Repository, Between } from 'typeorm';
import { OptionEntity } from './entities/option.entity';
import { Injectable } from '@nestjs/common';
import { UpdateOptionDto } from './dto/update-option.dto';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import axios from 'axios';
import * as sha1 from 'sha-1';
import { donatelloDto } from './dto/donatello.dto';
import { BillingEntity } from './../billing/entities/billing.entity';
import { JwtService } from '@nestjs/jwt';
import nodemailer from 'nodemailer';

interface IFondyMerchant {
  amount: string;
  currency: string;
  merchant_data: string;
  merchant_id: string;
  order_desc: string;
  order_id: string;
  response_url: string;
  signature?: string;
}

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
    @InjectRepository(BillingEntity)
    private billingRepository: Repository<BillingEntity>,
    private jwtService: JwtService,
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

  async getBillingInfo(userId: number) {
    const { createdDate, email } = await this.userRepository.findOneBy({
      id: userId,
    });
    const { paid } = await this.optionRepository.findOneBy({ userId });

    const { data } = await axios(
      'https://diaka.ua/api/v1/message/stats?action=recent&conveyorHash=ledVV43_827rc2Wroo7NLOs5tJrdfnja&params%5Blimit%5D=10&params%5Btest%5D=1',
    );
    const { diakaArr } = await this.billingRepository.findOneBy({ id: 1 });
    if (JSON.stringify(data) !== JSON.stringify(diakaArr)) {
      await this.billingRepository.update({ id: 1 }, { diakaArr: data });
      if (email === data[0].name) {
        const duration = data[0].amount < 100 ? 'month' : 'year';

        let newPaid = null;
        if (!paid || moment(paid).isBefore(moment())) {
          newPaid = moment().add(1, duration).toDate();
        } else {
          newPaid = moment(paid).add(1, duration).toDate();
        }

        await this.optionRepository.update(
          { userId },
          {
            paid: newPaid,
          },
        );
      }
    }

    const daysFromReg = moment().diff(moment(createdDate), 'days');
    const demo = daysFromReg < 30;
    const demoDays = demo ? 30 - daysFromReg : 0;
    const paidDays = paid
      ? moment(paid).diff(moment(Date.now()), 'days') > 0
        ? moment(paid).diff(moment(Date.now()), 'days')
        : 0
      : 0;

    return {
      demo,
      daysFromReg,
      demoDays,
      paidDays,
    };
  }

  async createMerchant(userId: number, amount: number) {
    const merchant_data = JSON.stringify({
      duration: amount === 200 ? 'month' : amount === 1400 ? 'year' : 'month',
      userId,
    });

    const merchantBody: IFondyMerchant = {
      amount: `${amount}`,
      currency: 'USD',
      merchant_data,
      merchant_id: process.env.MERCHANT_ID,
      order_desc: `Subscription T-App - 1 ${
        JSON.parse(merchant_data).duration
      }`,
      order_id: `${userId}_${Date.now()}`,
      response_url: 'https://t-app-api.onrender.com/api/option/confirmmerchant',
      //response_url: 'http://ptsv2.com/t/4l2iq-1667125397/post',
    };
    merchantBody.signature = sha1(
      process.env.MERCHANT_PASS + '|' + Object.values(merchantBody).join('|'),
    );

    const { data } = await axios.post(
      'https://pay.fondy.eu/api/checkout/url/',
      {
        request: merchantBody,
      },
    );
    return data;
  }

  async confirmMerchant(dto: any) {
    const { userId, duration } = JSON.parse(dto.merchant_data);
    const { paid } = await this.optionRepository.findOneBy({ userId });
    let newPaid = null;
    if (!paid || moment(paid).isBefore(moment())) {
      newPaid = moment().add(1, duration).toDate();
    } else {
      newPaid = moment(paid).add(1, duration).toDate();
    }

    await this.optionRepository.update(
      { userId },
      {
        paid: newPaid,
      },
    );
  }

  async confirmDonatello(dto: donatelloDto) {
    if (dto.key !== '200' && dto.key !== '1400') {
      return 'fail';
    }
    const { id } = await this.userRepository.findOneBy({
      email: dto.clientName.trim().toLocaleLowerCase(),
    });
    const { paid } = await this.optionRepository.findOneBy({ userId: id });
    let newPaid = null;
    const duration = Number(dto.key) === 200 ? 'month' : 'year';

    if (!paid || moment(paid).isBefore(moment())) {
      newPaid = moment().add(1, duration).toDate();
    } else {
      newPaid = moment(paid).add(1, duration).toDate();
    }

    await this.optionRepository.update(
      { userId: id },
      {
        paid: newPaid,
      },
    );
    return 'success';
  }

  async yoomoneyMessage(bearer: string) {
    const token = bearer.split(' ')[1];
    const { email } = this.jwtService.decode(token) as {
      [key: string]: string;
    };

    const transporter = nodemailer.createTransport({
      host: 'smtp.ukr.net',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.NODEMAILER_EMAIL, // generated ethereal user
        pass: process.env.NODEMAILER_EMAIL_PASSWORD, // generated ethereal password
      },
    });

    await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL, // sender address
      to: 'teachers.app24@gmail.com', // list of receivers
      subject: 'Check Access to T-App', // Subject line
      text: email, // plain text body
    });

    return 'success';
  }
}

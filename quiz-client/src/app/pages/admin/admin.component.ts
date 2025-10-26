import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionService } from 'src/app/services/question/question.service';
import { IQuestion } from '../../interface/question';
import { GroupGameService } from 'src/app/services/group-game/group-game.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  title: string = 'Админ панель';

  questionForm: FormGroup;
  groupGames: any[] = []; // список видов игр

  get options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private questionService: QuestionService,
    private groupGameService: GroupGameService,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      text: ['', Validators.required],
      type: ['single', Validators.required],
      gameGroupId: ['', Validators.required], 
      options: this.fb.array([])
    });

    // Следим за изменением типа — очищаем поля при смене
    this.questionForm.get('type')?.valueChanges.subscribe((type) => {
      if (type === 'open') {
        this.options.clear();
        this.questionForm.get('correctAnswers')?.setValue('');
      } else {
        if (this.options.length === 0) this.addOption();
      }
    });

    // загружаем все виды игр
    this.groupGameService.getAllGroupGame().subscribe({
      next: (data) => {
        this.groupGames = data;
      },
      error: (error) => console.log("Ошибка при загрузке видов игр:", error)
    });
  }

  getOptionControl(index: number): FormControl {
    return this.options.at(index) as FormControl;
  }

  addOption(): void {
    this.options.push(this.fb.control('', Validators.required));
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  toggleCorrectAnswer(index: number): void {
    const type = this.questionForm.get('type')?.value;
    const currentOption = this.options.at(index).value;

    // Если уже помечен как правильный — убираем звёздочку
    if (currentOption.startsWith('*')) {
      this.options.at(index).setValue(currentOption.replace(/^\*\s*/, ''));
      return;
    }

    // Если single — очищаем все остальные
    if (type === 'single') {
      this.options.controls.forEach((ctrl, i) => {
        ctrl.setValue(ctrl.value.replace(/^\*\s*/, ''));
      });
    }

    // Добавляем звёздочку
    this.options.at(index).setValue(`*${currentOption}`);
  }

  submit(): void {
    if (this.questionForm.invalid) {
      this.questionForm.markAllAsTouched();
      return;
    }

    const question: IQuestion = this.questionForm.value;
    console.log('Создан вопрос:', question);

    // Отправка на сервер
    this.questionService.addQuestion(question).subscribe({
      next: () => {
        alert('Вопрос успешно создан!');
        this.questionForm.reset({ type: 'single', options: [] });
      },
      error: (err) => console.error('Ошибка при создании вопроса:', err)
    });
  }
}

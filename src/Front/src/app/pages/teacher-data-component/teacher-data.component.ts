import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TablesComponent } from '../../shared-new/tables/tables.component';
import { InputsComponent } from '../../shared-new/inputs/inputs.component';
import { Inputs } from '../../shared-new/inputs/inputs';
import { Selects } from '../../shared-new/selects/selects';
import { TableConfig } from '../../models/table-config.model';
import { TableColumnTypes } from '../../shared-new/tables/table-column-types';
import { AuthService } from '../../Services/AuthService/AuthService';
import { Department } from '../../Services/Department/department';
import { DepartmentService } from '../../Services/Department/DepartmentService';
import { SelectsComponent } from '../../shared-new/selects/selects.component';
import { LangFieldPipe } from '../../Ppipes/langField.pipe';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { DocumentService } from '../../Services/Document/DocumetService';
import { DocumentStatus } from '../../Services/Document/Document';

@Component({
  selector: 'app-teacher-data',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TablesComponent,
    InputsComponent,
    SelectsComponent,
    LangFieldPipe,
    TranslocoPipe
  ],
  templateUrl: './teacher-data.component.html',
  styleUrl: './teacher-data.component.scss'
})
export class TeacherDataComponent implements OnInit {
  private authService = inject(AuthService);
  private departmentService = inject(DepartmentService);
  private translocoService = inject(TranslocoService);
  private documentService = inject(DocumentService);

  readonly inputTypes = Inputs;
  readonly selectTypes = Selects;

  departments = signal<Department[]>([]);


  teachers: any[] = [];

  teacherForm = new FormGroup({
    fullName: new FormControl(''),
    iin: new FormControl('', [Validators.minLength(12)]),
    birthDate: new FormControl(''),
    departmentId: new FormControl<number | null>(null),
    departmentName: new FormControl(''),
    experience: new FormControl(0),
    disciplineCode: new FormControl(''),
    discipline: new FormControl(''),
    educationalProgram: new FormControl(''),
    departmentOP: new FormControl(''),
    group: new FormControl(''),
    semester: new FormControl(1),
    degree: new FormControl(''),
    contingent: new FormControl(0),
    contingentByRegistration: new FormControl(0),
    totalStreams: new FormControl(0),
    lectureStreams: new FormControl(0),
    practiceStreams: new FormControl(0),
    labStreams: new FormControl(0),
    lectureHours: new FormControl(0),
    practiceHours: new FormControl(0),
    labHours: new FormControl(0),
    srsp: new FormControl(0),
    rk: new FormControl(0),
    exam: new FormControl(0),
    normative: new FormControl(0),
    total: new FormControl(0),
    isHourly: new FormControl(false),
    isElective: new FormControl(false),
    isCoursera: new FormControl(false),
    position: new FormControl(''),
    paymentType: new FormControl(''),
    hoursCount: new FormControl(0),
    staffOrHourlyUnits: new FormControl(0),
    staffUnits: new FormControl(0),
    hourlyUnits: new FormControl(0),
    staffLoad: new FormControl(0),
    hourlyLoad: new FormControl(0)
  });

  ngOnInit(): void {
    this.initTableConfig();
    this.loadDepartments();
    this.loadMyDocuments();

    this.translocoService.langChanges$.subscribe(() => this.initTableConfig());

    const user = this.authService.currentUser();
    if (user) {
      this.teacherForm.patchValue({
        fullName: user.fio || '',
        iin: user.sub || user.iin || '',
        position: user.position || '',
        disciplineCode: '',
      });
    }
    this.setupTotalCalculation();
  }


  loadMyDocuments(): void {
    this.documentService.getAll().subscribe({
      next: (data: any[]) => {
        this.teachers = data.map(doc => {

          const load = doc.academicLoads && doc.academicLoads.length > 0 ? doc.academicLoads[0] : {};
          const payment = doc.paymentDetails && doc.paymentDetails.length > 0 ? doc.paymentDetails[0] : {};

          return {
            ...doc,

            fullName: doc.author?.fullName || '',
            iin: doc.author?.iin || '',
            departmentName: doc.author?.department?.nameRu || '',
            degree: doc.description || '',


            discipline: load.discipline || '',
            group: load.studentGroup || '',
            totalStreams: load.totalStreams || 0,
            lectureHours: load.lectureHours || 0,
            practiceHours: load.practiceHours || 0,
            labHours: load.labHours || 0,
            total: load.totalHours || 0,


            position: doc.author?.position || '',
            paymentType: payment.paymentType || 'Штатный',
            hoursCount: payment.hoursCount || 0,
            staffOrHourlyUnits: payment.staffLoad || 0,
            staffLoad: payment.staffLoad || 0,
            hourlyLoad: payment.hourlyLoad || 0
          };
        });
        console.log('Документы загружены и обработаны:', this.teachers);
      },
      error: (err) => console.error('Ошибка при получении документов:', err)
    });
  }

  readonly degreeOptions = [
    { id: '1', name: '1 курс' },
    { id: '2', name: '2 курс' },
    { id: '3', name: '3 курс' },
    { id: '4', name: '4 курс' },
    { id: 'mag', name: 'Магистратура' },
    { id: 'doc', name: 'Докторантура' }
  ];

  private setupTotalCalculation(): void {
    const fieldsToWatch = ['lectureHours', 'practiceHours', 'labHours', 'srsp', 'rk', 'exam'];
    this.teacherForm.valueChanges.subscribe(() => {
      const total = fieldsToWatch.reduce((acc, field) => {
        const control = this.teacherForm.get(field);
        return acc + (Number(control?.value) || 0);
      }, 0);
      this.teacherForm.patchValue({ total }, { emitEvent: false });
    });
  }

  tableConfigMain: TableConfig = { columns: [] };
  tableConfigLoad: TableConfig = { columns: [] };
  tableConfigPayment: TableConfig = { columns: [] };

  initTableConfig(): void {
    const translate = (key: string) => this.translocoService.translate(`teacher.${key}`);

    this.tableConfigMain = {
      columns: [
        { key: 'index', title: '№', type: TableColumnTypes.index },
        { key: 'fullName', title: translate('fullName'), type: TableColumnTypes.text },
        { key: 'iin', title: translate('iin'), type: TableColumnTypes.text },
        { key: 'departmentName', title: translate('department'), type: TableColumnTypes.text },
        { key: 'degree', title: translate('degree'), type: TableColumnTypes.text }
      ]
    };

    this.tableConfigLoad = {
      columns: [
        { key: 'index', title: '№', type: TableColumnTypes.index },
        { key: 'discipline', title: translate('discipline'), type: TableColumnTypes.text },
        { key: 'group', title: translate('group'), type: TableColumnTypes.text },
        { key: 'totalStreams', title: translate('totalStreams'), type: TableColumnTypes.text },
        { key: 'lectureHours', title: translate('lectures'), type: TableColumnTypes.text },
        { key: 'practiceHours', title: translate('practice'), type: TableColumnTypes.text },
        { key: 'labHours', title: translate('labs'), type: TableColumnTypes.text },
        { key: 'total', title: translate('total'), type: TableColumnTypes.text }
      ]
    };

    this.tableConfigPayment = {
      columns: [
        { key: 'index', title: '№', type: TableColumnTypes.index },
        { key: 'position', title: translate('position'), type: TableColumnTypes.text },
        { key: 'paymentType', title: translate('paymentType'), type: TableColumnTypes.text },
        { key: 'hoursCount', title: translate('hoursCount'), type: TableColumnTypes.text },
        { key: 'staffOrHourlyUnits', title: translate('staffOrHourlyUnits'), type: TableColumnTypes.text },
        { key: 'staffLoad', title: translate('staffLoad'), type: TableColumnTypes.text },
        { key: 'hourlyLoad', title: translate('hourlyLoad'), type: TableColumnTypes.text }
      ]
    };
  }

  readonly semesterOptions = [
    { id: 1, name: '1' },
    { id: 2, name: '2' }
  ];

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (data: Department[]) => this.departments.set(data),
      error: (err: any) => console.error('Ошибка бэкенда:', err)
    });
  }

  onDepartmentChange(event: any) {
    const selectedDept = this.departments().find(d => d.id === event.value);
    if (selectedDept) {
      const lang = this.translocoService.getActiveLang();
      const nameKey = lang === 'kk' ? 'nameKz' : (lang === 'en' ? 'nameEn' : 'nameRu');
      this.teacherForm.patchValue({
        departmentName: (selectedDept as any)[nameKey]
      });
    }
  }

  save() {
    if (this.teacherForm.invalid) {
      const invalidFields = this.findInvalidControls();
      this.teacherForm.markAllAsTouched();
      alert(`Заполните обязательные поля: ${invalidFields.join(', ')}`);
      return;
    }

    const formValue = this.teacherForm.getRawValue();
    const documentToSave: any = {
      status: DocumentStatus.DRAFT,
      academicYear: "2025-2026",
      semester: Number(formValue.semester),
      goals: "Заполнение данных преподавателя",
      description: formValue.educationalProgram || 'Данные преподавателя',
      disciplineId: formValue.departmentId,

      academicLoads: [
        {
          discipline: formValue.discipline || formValue.disciplineCode,
          studentGroup: formValue.group,
          totalStreams: String(formValue.totalStreams || 0),
          lectureHours: Number(formValue.lectureHours || 0),
          practiceHours: Number(formValue.practiceHours || 0),
          labHours: Number(formValue.labHours || 0),
          totalHours: Number(formValue.total || 0)
        }
      ],

      paymentDetails: [
        {
          staffLoad: formValue.staffLoad || 0,
          hourlyLoad: formValue.hourlyLoad || 0
        }
      ]
    };

    this.documentService.save(documentToSave).subscribe({
      next: () => {
        this.loadMyDocuments();
        this.resetForm();
        alert('Данные успешно сохранены!');
      },
      error: (err) => {
        alert('Ошибка при сохранении: ' + (err.error?.message || 'Сервер недоступен'));
      }
    });
  }

  private findInvalidControls(): string[] {
    const invalid = [];
    const controls = this.teacherForm.controls;
    for (const name in controls) {
      if (controls[name as keyof typeof controls].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  private resetForm() {
    const user = this.authService.currentUser();
    this.teacherForm.reset({
      fullName: user?.fio || '',
      iin: user?.sub || user?.iin || '',
      position: user?.position || '',
      experience: 0,
      semester: 1,
      disciplineCode: '',
      total: 0
    });
  }
}

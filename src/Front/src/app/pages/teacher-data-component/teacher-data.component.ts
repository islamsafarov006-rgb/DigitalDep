import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
  private cdr = inject(ChangeDetectorRef);

  readonly inputTypes = Inputs;
  readonly selectTypes = Selects;

  departments = signal<Department[]>([]);
  teachers = signal<any[]>([]);

  teacherForm = new FormGroup({
    fullName: new FormControl({ value: '', disabled: true }),
    iin: new FormControl({ value: '', disabled: true }),
    departmentName: new FormControl({ value: '', disabled: true }),

    birthDate: new FormControl(''),
    departmentId: new FormControl<number | null>(null),
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
    total: new FormControl({ value: 0, disabled: true }),
    isHourly: new FormControl(false),
    isElective: new FormControl(false),
    isCoursera: new FormControl(false),
    position: new FormControl({ value: '', disabled: true }),
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
    this.loadMyDocuments();

    this.translocoService.langChanges$.subscribe(() => {
      this.initTableConfig();
      this.updateDepartmentName();
    });

    this.departmentService.getAll().subscribe({
      next: (data: Department[]) => {
        this.departments.set(data);

        const user = this.authService.currentUser();
        if (user) {
          const userDeptId = user.departmentId || user.department?.id || 5;

          this.teacherForm.patchValue({
            fullName: user.fullName || user.fio || '',
            iin: user.iin || user.sub || '',
            position: user.position || '',
            departmentId: userDeptId
          });

          setTimeout(() => {
            this.updateDepartmentName();
            this.cdr.detectChanges();
          });
        }
      },
      error: (err: any) => console.error('Ошибка загрузки кафедр:', err)
    });

    this.setupTotalCalculation();
  }

  updateDepartmentName() {
    const currentDeptId = this.teacherForm.get('departmentId')?.value;
    if (currentDeptId && this.departments().length > 0) {
      const selectedDept = this.departments().find(d => d.id === currentDeptId);
      if (selectedDept) {
        const lang = this.translocoService.getActiveLang();
        const nameKey = lang === 'kk' ? 'name_kz' : (lang === 'en' ? 'name_en' : 'name_ru');
        const departmentName = (selectedDept as any)[nameKey] || (selectedDept as any).nameRu || '';

        this.teacherForm.get('departmentName')?.setValue(departmentName, { emitEvent: false });
      }
    }
  }

  onDepartmentChange(event: any) {
    const selectedDept = this.departments().find(d => d.id === event.value);
    if (selectedDept) {
      const lang = this.translocoService.getActiveLang();
      const nameKey = lang === 'kk' ? 'name_kz' : (lang === 'en' ? 'name_en' : 'name_ru');
      const departmentName = (selectedDept as any)[nameKey] || (selectedDept as any).nameRu || '';
      this.teacherForm.get('departmentName')?.setValue(departmentName);
    }
  }

  loadMyDocuments(): void {
    this.documentService.getAll().subscribe({
      next: (data: any[]) => {
        const mapped = data.map(doc => {
          const load = doc.academicLoads?.[0] || {};
          const payment = doc.paymentDetails?.[0] || {};
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
        this.teachers.set(mapped);
        this.cdr.detectChanges();
      },
      error: (err:any) => console.error('Ошибка получения документов:', err)
    });
  }

  private setupTotalCalculation(): void {
    const fieldsToWatch = ['lectureHours', 'practiceHours', 'labHours', 'srsp', 'rk', 'exam'];
    this.teacherForm.valueChanges.subscribe(() => {
      const total = fieldsToWatch.reduce((acc, field) => {
        const control = this.teacherForm.get(field);
        return acc + (Number(control?.value) || 0);
      }, 0);
      this.teacherForm.get('total')?.setValue(total, { emitEvent: false });
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

  readonly degreeOptions = [
    { id: '1', name: '1 курс' }, { id: '2', name: '2 курс' },
    { id: '3', name: '3 курс' }, { id: '4', name: '4 курс' },
    { id: 'mag', name: 'Магистратура' }, { id: 'doc', name: 'Докторантура' }
  ];

  readonly semesterOptions = [ { id: 1, name: '1' }, { id: 2, name: '2' } ];

  private resetForm() {
    const user = this.authService.currentUser();
    this.teacherForm.reset({
      fullName: user?.fio || '',
      iin: user?.sub || user?.iin || '',
      position: user?.position || '',
      semester: 1,
      total: 0
    });
    this.updateDepartmentName();
  }
}

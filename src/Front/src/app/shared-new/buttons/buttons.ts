import {Icons} from '../icon/icons';

export enum ButtonsType {
    borderButton = 'border-button',
    fillButton = 'fill-button',
    fillBorderButton = 'fill-border-button',
    headerButton = 'header-button',
    simpleButton = 'simple-button',
    whiteSimpleButton = 'white-simple-button',
    iconButton = 'icon-button',
    whiteIconButton = 'white-icon-button',
    textButton = 'text-button',
    whiteTextButton = 'white-text-button',
    primaryIconButton = 'primary-icon-button',
    warningIconButton = 'warning-icon-button',
    errorIconButton = 'error-icon-button',
    fillTextButton = 'fill-text-button',
    textCheckButton = 'text-check-button'
}

export class ButtonsConstants {
    public static readonly Buttons = {
        back: {
            type: ButtonsType.borderButton,
            icon: Icons.back,
            title: 'back',
            clickType: 'back'
        },
        next: {
            type: ButtonsType.fillButton,
            icon: Icons.doubleChevronRight,
            iconSize: 16,
            title: 'next',
            clickType: 'next'
        },
        finish: {
            type: ButtonsType.fillButton,
            icon: Icons.doubleChevronRight,
            iconSize: 16,
            title: 'finish',
            clickType: 'finish'
        },
        whiteBorderFinish: {
            type: ButtonsType.fillBorderButton,
            icon: Icons.ok,
            iconSize: 16,
            title: 'finish',
            clickType: 'finish'
        },
        sendDocToCJS: {
            type: ButtonsType.fillBorderButton,
            icon: Icons.send,
            iconSize: 16,
            title: 'sendDocToCJS',
            clickType: 'sendDocToCJS'
        },
        directSupervisor: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.position,
            iconSize: 16,
            title: 'monitoring.directSupervisor',
            clickType: 'directSupervisor'
        },
        hrOfficer: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.position,
            iconSize: 16,
            title: 'monitoring.hrOfficer',
            clickType: 'hrOfficer'
        },
        send: {
            type: ButtonsType.fillButton,
            icon: Icons.send,
            title: 'send',
            clickType: 'send'
        },
        sendHeader: {
            type: ButtonsType.headerButton,
            icon: Icons.send,
            title: 'send',
            clickType: 'sendHeader'
        },
        activate: {
            type: ButtonsType.fillButton,
            icon: Icons.ok,
            title: 'activate',
            clickType: 'activate'
        },
        activateHeader: {
            type: ButtonsType.headerButton,
            icon: Icons.ok,
            title: 'activate',
            clickType: 'activateHeader'
        },
        save: {
            type: ButtonsType.headerButton,
            icon: Icons.save,
            title: 'save',
            clickType: 'save'
        },
        cancel: {
            type: ButtonsType.headerButton,
            icon: Icons.closeSquare,
            title: 'cancel',
            clickType: 'cancel'
        },
        selectAll: {
            type: ButtonsType.textButton,
            icon: '',
            title: 'selectAllEmails',
            clickType: 'selectAll'
        },
        unselectAll: {
            type: ButtonsType.textButton,
            icon: '',
            title: 'unselectAll',
            clickType: 'unselectAll'
        },
        viewDoc: {
            type: ButtonsType.headerButton,
            icon: Icons.print,
            title: 'document-view',
            clickType: 'viewDoc'
        },
        viewTableItem: {
            type: ButtonsType.headerButton,
            icon: Icons.viewIcon,
            title: '',
            clickType: 'viewTableItem'
        },
        requirementView: {
            type: ButtonsType.simpleButton,
            icon: Icons.viewIcon,
            title: 'requirements',
            clickType: 'requirementView'
        },
        complianceProfileView: {
            type: ButtonsType.simpleButton,
            icon: Icons.viewIcon,
            title: 'complianceProfile',
            clickType: 'complianceProfileView'
        },
        openApprovalProcess: {
            type: ButtonsType.headerButton,
            icon: Icons.documentEdit,
            title: 'approvalProgress',
            clickType: 'openApprovalProcess'
        },
        viewContestData: {
            type: ButtonsType.headerButton,
            icon: Icons.viewIcon,
            title: 'viewContestData',
            clickType: 'viewContestData'
        },
        vacationHistory: {
            type: ButtonsType.headerButton,
            icon: Icons.locationIcon,
            title: 'vacationHistory',
            clickType: 'vacationHistory'
        },
        print: {
            type: ButtonsType.headerButton,
            icon: Icons.print,
            title: 'print2',
            clickType: 'print2'
        },
        export: {
            type: ButtonsType.headerButton,
            icon: Icons.fileDown,
            title: 'export',
            clickType: 'export'
        },
        import: {
            type: ButtonsType.headerButton,
            icon: Icons.fileUp,
            title: 'import',
            clickType: 'import'
        },
        familyComposition: {
            type: ButtonsType.headerButton,
            icon: Icons.peopleBlue,
            title: 'familyComposition',
            clickType: 'familyComposition'
        },
        personalInfo: {
            type: ButtonsType.headerButton,
            icon: Icons.personCircle,
            title: 'personalBusinessLowerCase',
            clickType: 'personalInfo'
        },
        attachFile: {
            type: ButtonsType.simpleButton,
            icon: Icons.attach,
            title: 'attach',
            clickType: 'attachFile'
        },
        attachFilePayment: {
            type: ButtonsType.simpleButton,
            icon: Icons.attach,
            title: 'attach',
            clickType: 'attachFilePayment'
        },
        attachFileBookedTickets: {
            type: ButtonsType.simpleButton,
            icon: Icons.attach,
            title: 'attach',
            clickType: 'attachFileBookedTickets'
        },
        attachFileEvent: {
            type: ButtonsType.simpleButton,
            icon: Icons.attach,
            title: 'attach',
            clickType: 'attachFileEvent'
        },
        viewFile : {
            type: ButtonsType.simpleButton,
            icon: Icons.view,
            title: 'viewPrep',
            clickType: 'viewFile'
        },
        viewFileEvent: {
            type: ButtonsType.simpleButton,
            icon: Icons.view,
            title: 'viewPrep',
            clickType: 'viewFileEvent'
        },
        viewFilePayment: {
            type: ButtonsType.simpleButton,
            icon: Icons.view,
            title: 'viewPrep',
            clickType: 'viewFilePayment'
        },
        viewFileBookedTickets: {
            type: ButtonsType.simpleButton,
            icon: Icons.view,
            title: 'viewPrep',
            clickType: 'viewFileBookedTickets'
        },
        hideFile: {
            type: ButtonsType.simpleButton,
            icon: Icons.fileUp,
            title: 'hideDocument',
            clickType: 'hideFile'
        },
        deleteFile: {
            type: ButtonsType.simpleButton,
            icon: Icons.delete,
            title: 'delete',
            clickType: 'deleteFile'
        },
        addApprovers: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.folderCheck,
            title: 'approvalList',
            clickType: 'addApprovers'
        },
        addApproversHeaderButton: {
            type: ButtonsType.headerButton,
            icon: Icons.folderCheck,
            title: 'approvalList',
            clickType: 'addApproversHeaderButton'
        },
        addListApprovers: {
            type: ButtonsType.headerButton,
            icon: Icons.folderCheck,
            title: 'qualificationRequirementShr.approvalList',
            clickType: 'addSigners'
        },
        endSubmit: {
            type: ButtonsType.fillButton,
            icon: Icons.send,
            title: 'send',
            clickType: 'submit'
        },
        addExecutorHeaderButton: {
            type: ButtonsType.headerButton,
            icon: Icons.folderCheck,
            title: 'choosePerformer',
            clickType: 'addExecutorHeaderButton'
        },
        listApprovers: {
            type: ButtonsType.simpleButton,
            icon: Icons.list,
            title: 'chooseApprovers',
            clickType: 'listApprovers'
        },
        authorButton: {
            type: ButtonsType.simpleButton,
            icon: Icons.person,
            title: 'pdai.author',
            clickType: 'authorButton'
        },
        seeMemoButton: {
            type: ButtonsType.simpleButton,
            icon: Icons.view,
            title: 'seeMEMO',
            clickType: 'seeMemoButton'
        },
        template: {
            type: ButtonsType.simpleButton,
            icon: Icons.template,
            title: 'template',
            clickType: 'template'
        },
        listAssigner: {
            type: ButtonsType.simpleButton,
            icon: Icons.edit,
            title: 'signer',
            clickType: 'listAssigner'
        },
        listToWhom: {
            type: ButtonsType.simpleButton,
            icon: Icons.edit,
            title: 'toWhom',
            clickType: 'listToWhom'
        },
        ok: {
            type: ButtonsType.fillButton,
            icon: Icons.ok,
            title: 'ОК',
            clickType: 'ok'
        },
        openComments: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.comment,
            title: 'reasonOfRejection',
            clickType: 'openComments'
        },
        deleteTableRow: {
            type: ButtonsType.iconButton,
            icon: Icons.closeSquare,
            title: '',
            clickType: 'deleteTableRow'
        },
        removeCondition: {
            type: ButtonsType.iconButton,
            icon: Icons.closeSquare,
            title: '',
            clickType: 'requirementModal.removeCondition'
        },
        addTableRow: {
            type: ButtonsType.iconButton,
            icon: Icons.add,
            title: '',
            clickType: 'addTableRow'
        },
        addRowForTable: {
            type: ButtonsType.simpleButton,
            icon: Icons.add,
            title: 'addRowForTable',
            clickType: 'addRowForTable'
        },
        deleteRowForTable: {
            type: ButtonsType.simpleButton,
            icon: Icons.closeSquare,
            title: 'deleteRowForTable',
            clickType: 'deleteRowForTable'
        },
        changeTitle: {
            type: ButtonsType.simpleButton,
            icon: Icons.penSquare,
            iconSize: 22,
            title: 'changeTitle',
            clickType: 'changeTitle'
        },
        downloadTable: {
            type: ButtonsType.iconButton,
            icon: Icons.download,
            title: '',
            clickType: 'downloadTable'
        },
        revision: {
            type: ButtonsType.borderButton,
            icon: Icons.editFile,
            title: 'revision',
            clickType: 'revision'
        },
        agree: {
            type: ButtonsType.fillButton,
            icon: Icons.ok,
            title: 'approve',
            clickType: 'agree'
        },
        forExecution:{
            type: ButtonsType.fillButton,
            icon: Icons.person,
            title: 'forExecution',
            clickType: 'forExecution'
        },
        showApplicationFile : {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.view,
            title: 'showApplication',
            clickType: 'showApplicationFile'
        },
        showAnketa : {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.view,
            title: 'showAnketa',
            clickType: 'showAnketa'
        },
        showDogovor : {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.view,
            title: 'showDogovor',
            clickType: 'showDogovor'
        },
        showServiceNoteFile : {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.view,
            title: 'showServiceNote',
            clickType: 'showServiceNoteFile'
        },
        refuse: {
            type: ButtonsType.borderButton,
            icon: Icons.closeSquare,
            title: 'reject',
            clickType: 'refuse'
        },
        sign: {
            type: ButtonsType.fillButton,
            icon: Icons.edit,
            title: 'sign',
            clickType: 'sign'
        },
        yes:{
            type: ButtonsType.fillButton,
            icon: Icons.ok,
            title: 'yes',
            clickType: 'yes'
        },
        addSelectedOnes: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.ok,
            title: 'addSelectedOnes',
            clickType: 'addSelectedOnes'
        },
        deleteSelectedOnes: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.delete,
            title: 'deleteSelectedOnes',
            clickType: 'deleteSelectedOnes'
        },
        deleteGroup: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.delete,
            title: 'delete',
            color: 'warn',
            tooltip: 'requirementModal.removeGroup',
            clickType: 'removeGroup'
        },
        removeEduCondition: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.delete,
            title: 'delete',
            color: 'warn',
            tooltip: 'requirementModal.removeGroup',
            clickType: 'removeGroup'
        },
        personalBusiness: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.person,
            title: 'personalBusinessLowerCase',
            clickType: 'personalBusiness'
        },
        copyEvaluator: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.ok,
            title: 'copyEvaluator',
            clickType: 'copyEvaluator',
        },
        removeEvaluator: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.delete,
            title: 'removeEvaluator',
            clickType: 'removeEvaluator'
        },
        chooseEvaluator: {
            type:ButtonsType.simpleButton,
            icon: Icons.person,
            title: 'chooseEvaluator',
            clickType: 'chooseEvaluator'
        },
        expandAllButtons: {
            type:ButtonsType.whiteSimpleButton,
            icon: Icons.expandAllV2,
            title: 'expandAll',
            clickType: 'expandAllButtons'
        },
        collapseAllButtons: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.collapseAll,
            title: 'collapseAll',
            clickType: 'collapseAllButtons'
        },
        selectEvaluatorNomenclature: {
            type: ButtonsType.simpleButton,
            icon: Icons.person,
            title: 'selectEvaluatorNomenclature',
            clickType: 'selectEvaluatorNomenclature'
        },
        sendAssessmentSheets: {
            type: ButtonsType.headerButton,
            icon: Icons.send,
            title: 'sendAssessmentSheets',
            clickType: 'sendAssessmentSheets'
        },
        sendForApproval: {
            type: ButtonsType.headerButton,
            icon: Icons.send,
            title: 'sendForApproval',
            clickType: 'sendForApproval'
        },
        agreeHeaderButton: {
            type: ButtonsType.headerButton,
            icon: Icons.ok,
            title: 'approve',
            clickType: 'agreeHeaderButton'
        },
        number1: {
            type: ButtonsType.whiteTextButton,
            icon: '',
            title: '1',
            clickType: 'number1'
        },
        number2: {
            type: ButtonsType.whiteTextButton,
            icon: '',
            title: '2',
            clickType: 'number2'
        },
        number3: {
            type: ButtonsType.whiteTextButton,
            icon: '',
            title: '3',
            clickType: 'number3'
        },
        number4: {
            type: ButtonsType.whiteTextButton,
            icon: '',
            title: '4',
            clickType: 'number4'
        },
        number5: {
            type: ButtonsType.whiteTextButton,
            icon: '',
            title: '5',
            clickType: 'number5'
        },
        signatures_list: {
            type: ButtonsType.fillButton,
            icon: Icons.edit,
            title: 'signatures_list',
            clickType: 'signList'
        },
        addDelegatePersonInfo: {
            type: ButtonsType.simpleButton,
            icon: Icons.add,
            iconSize: 25,
            title: 'add',
            clickType: 'addDelegatePersonInfo'
        },
        addHirePerson: {
            type: ButtonsType.textButton,
            icon: '',
            iconSize: 25,
            title: 'hirePerson',
            clickType: 'addHirePerson'
        },
        vacationOrderType: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.orderDocument,
            title: 'selectVacationOrder',
            clickType: 'vacationOrderType'
        },
        unassignPerson: {
            type: ButtonsType.textButton,
            icon: '',
            iconSize: 25,
            title: 'Снять',
            clickType: 'unassignPerson'
        },
        ruLabelSimple: {
            type: ButtonsType.simpleButton,
            icon: Icons.edit,
            iconSize: 25,
            title: 'ruLabel',
            clickType: 'ruLabelSimple'
        },
        kzLabelSimple: {
            type: ButtonsType.simpleButton,
            icon: Icons.edit,
            iconSize: 25,
            title: 'kzLabel',
            clickType: 'kzLabelSimple'
        },
        clear: {
            type: ButtonsType.simpleButton,
            icon: Icons.rubber,
            iconSize: 25,
            title: 'clear',
            clickType: 'clear'
        },
        reset: {
            type: ButtonsType.simpleButton,
            icon: Icons.closeSquare,
            iconSize: 25,
            title: 'reset',
            clickType: 'reset'
        },
        saveSimpleButton: {
            type: ButtonsType.simpleButton,
            icon: Icons.save,
            title: 'save',
            clickType: 'saveSimpleButton'
        },
        createTemplate: {
            type: ButtonsType.simpleButton,
            icon: Icons.add,
            iconSize: 25,
            title: 'add',
            clickType: 'createTemplate'
        },
        editDelegatePersonInfo: {
            type: ButtonsType.simpleButton,
            icon: Icons.penSquare,
            iconSize: 22,
            title: 'edit',
            clickType: 'editDelegatePersonInfo'
        },
        removeDelegatePerson: {
            type: ButtonsType.simpleButton,
            icon: Icons.closeSquare,
            title: 'delete',
            clickType: 'removeDelegatePerson'
        },
        previewTableButton: {
            type: ButtonsType.primaryIconButton,
            icon: Icons.eye,
            iconSize: 16,
            title: 'preview',
            clickType: 'previewTableButton'
        },
        editTableButton: {
            type: ButtonsType.warningIconButton,
            icon: Icons.penSquare,
            iconSize: 16,
            title: 'edit',
            clickType: 'editTableButton'
        },
        deleteTableButton: {
            type: ButtonsType.errorIconButton,
            icon: Icons.trash,
            iconSize: 16,
            title: 'delete',
            clickType: 'deleteTableButton'
        },
        saveFill: {
            type: ButtonsType.fillButton,
            icon: Icons.save,
            title: 'save',
            clickType: 'saveFill'
        },
        saveTableButton: {
            type: ButtonsType.iconButton,
            icon: Icons.save,
            iconSize: 16,
            title: 'save',
            clickType: 'saveTableButton'
        },
        cancelTableButton: {
            type: ButtonsType.iconButton,
            icon: Icons.cancel,
            title: 'cancel',
            clickType: 'cancelTableButton'
        },
        delete: {
            type: ButtonsType.fillButton,
            icon: Icons.trash,
            title: 'delete',
            clickType: 'delete'
        },
        deleteWhite: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.trash,
            title: 'delete',
            clickType: 'deleteWhite'
        },
        deleteSimple: {
            type: ButtonsType.simpleButton,
            icon: Icons.trash,
            title: 'delete',
            clickType: 'deleteSimple'
        },
        search: {
            type: ButtonsType.simpleButton,
            icon: Icons.search,
            title: 'justSearch',
            clickType: 'search'
        },
        decline:{
            type: ButtonsType.simpleButton,
            icon: Icons.userStar,
            title: 'declineByCases',
            clickType: 'decline'
        },
        cancelFill: {
            type: ButtonsType.fillButton,
            icon: Icons.closeSquare,
            title: 'cancel',
            clickType: 'cancelFill'
        },
        signWhite: {
            type: ButtonsType.headerButton,
            icon: Icons.edit,
            title: 'sign',
            clickType: 'signWhite'
        },
        collapseAll: {
            type: ButtonsType.borderButton,
            icon: Icons.fileUp,
            title: 'collapseAll',
            clickType: 'collapseAll'
        },
        expandAll: {
            type: ButtonsType.borderButton,
            icon: Icons.expandAll,
            title: 'expandAll',
            clickType: 'expandAll'
        },
        download: {
            type: ButtonsType.fillButton,
            icon: Icons.download,
            title: 'download',
            clickType: 'download'
        },
        finalizeProject: {
            type: ButtonsType.fillButton,
            icon: Icons.ok,
            title: 'finalizeProject',
            clickType: 'finalizeProject'
        },
        finalizeProjectHeader: {
            type: ButtonsType.headerButton,
            icon: Icons.ok,
            title: 'finalizeProject',
            clickType: 'finalizeProjectHeader'
        },
        letterRequest: {
            type: ButtonsType.fillButton,
            icon: Icons.ok,
            title: 'letterRequest',
            clickType: 'letterRequest'
        },
        iconSpan: {
            type: ButtonsType.fillButton,
            icon: Icons.govOrg,
            title: 'organization',
            clickType: 'iconSpan'
        },
        govOrgSimple:{
            type: ButtonsType.simpleButton,
            icon: Icons.govOrg,
            title: 'addGovernmentAgency',
            clickType: 'govOrgSimple'
        },
        flRequestSimple:{
            type: ButtonsType.simpleButton,
            icon: Icons.ok,
            title: 'flRequest',
            clickType: 'flRequestSimple'
        },
        addGov:{
            type: ButtonsType.simpleButton,
            icon: Icons.govOrg,
            title: 'addGO',
            clickType: 'addGov'
        },
        removeGov:{
            type: ButtonsType.simpleButton,
            icon: Icons.govOrg,
            title: 'delete',
            clickType: 'removeGov'
        },
        throwOff: {
            type: ButtonsType.whiteTextButton,
            icon:'',
            title: 'drop',
            clickType: 'throwOff'
        },
        apply: {
            type: ButtonsType.fillTextButton,
            icon:'',
            title: 'apply',
            clickType: 'apply'
        },
        selectPerformer: {
            type: ButtonsType.fillButton,
            icon: Icons.userSelected,
            title: 'selectPerformer',
            clickType: 'selectPerformer'
        },
        approve: {
            type: ButtonsType.borderButton,
            icon: Icons.ok,
            title: 'approve',
            clickType: 'approve'
        },
        approved: {
            type: ButtonsType.fillButton,
            icon: Icons.ok,
            title: 'approved',
            clickType: 'approved'
        },
        approvedAll: {
            type: ButtonsType.fillTextButton,
            icon: Icons.userSelected,
            title: 'coordinateEverything',
            clickType: 'approvedAll'
        },
        refuseAll: {
            type: ButtonsType.fillTextButton,
            icon: Icons.closeSquare,
            title: 'rejectEverything',
            clickType: 'refuseAll'
        },
        refuseFill: {
            type: ButtonsType.fillButton,
            icon: Icons.closeSquare,
            title: 'revision',
            clickType: 'refuse'
        },
        historyResolution: {
            type: ButtonsType.headerButton,
            icon: Icons.save,
            title: 'historyResolution',
            clickType: 'historyResolution'
        },
        completeWork: {
            type: ButtonsType.headerButton,
            icon: Icons.ok,
            title: 'completeWork',
            clickType: 'completeWork'
        },
        attachResolution: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.attach,
            title: 'attachResolution',
            clickType: 'attachResolution'
        },
        deletePosition: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.usersRemove,
            title: 'deletePosition',
            clickType: 'deletePosition'
        },
        creatPosition: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.usersAdd,
            title: 'createPosition',
            clickType: 'creatPosition'
        },
        position: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.position,
            title: 'position',
            clickType: 'position'
        },
        historyPosition: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.positionHistory,
            title: 'historyOfThePost',
            clickType: 'historyPosition'
        },
        historyAboutCourses: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.positionHistory,
            title: 'historyOfCourses',
            clickType: 'historyAboutCourses'
        },
        selectCourses: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.globus,
            title: 'selectCourses',
            clickType: 'selectCourses'
        },
        employeeFile: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.userSquare,
            title: 'personalBusinessLowerCase',
            clickType: 'employeeFile'
        },
        view: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.view,
            title: 'view',
            clickType: 'view'
        },
        delate: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.view,
            title: 'view',
            clickType: 'view'
        },
        fillStaticOrganizationData: {
            type: ButtonsType.simpleButton,
            icon: Icons.documentCheck,
            title: 'getData',
            clickType: 'fillStaticOrganizationData'
        },
        saveBottom: {
            type: ButtonsType.borderButton,
            icon: Icons.save,
            title: 'save',
            clickType: 'saveBottom'
        },
        textCheckButtonSimple:{
            type: ButtonsType.textCheckButton,
            icon: Icons.ok,
            title: 'forAllOrgs',
            clickType: 'textCheckButtonSimple'
        },
        addJustification: {
            type: ButtonsType.simpleButton,
            icon: Icons.add,
            title: 'addJustification',
            clickType: 'addJustification'
        },
        misconductInfo: {
            type: ButtonsType.headerButton,
            icon: Icons.article,
            title: 'misconductInfo',
            clickType: 'misconductInfo'
        },
        viewDoc2: {
            type: ButtonsType.headerButton,
            icon: Icons.eye,
            title: 'document-view',
            clickType: 'viewDoc2'
        },
        penaltyHistory: {
            type: ButtonsType.headerButton,
            icon: Icons.documentEdit,
            title: 'penaltyHistory',
            clickType: 'penaltyHistory'
        },
        executorSelection : {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.person,
            title: 'selectPerformer',
            clickType: 'executorSelection'
        },
        chooseEmployee : {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.person,
            title: 'chooseEmployee',
            clickType: 'chooseEmployee'
        },
        selectPublicAuthority: {
            type: ButtonsType.fillButton,
            icon: Icons.addDictionaries,
            title: 'selectPublicAuthority',
            clickType: 'selectPublicAuthority'
        },
        createNewResolution: {
            type: ButtonsType.fillButton,
            icon: Icons.addDictionaries,
            title: 'createNewResolution',
            clickType: 'createNewResolution'
        },
        cancelBorder: {
            type: ButtonsType.borderButton,
            icon: Icons.closeSquare,
            title: 'cancel',
            clickType: 'cancelBorder'
        },
        continueFbsh: {
            type: ButtonsType.fillButton,
            icon: Icons.addDictionaries,
            title: 'continueWorking',
            clickType: 'continueFbsh'
        },
        restrict: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.closeSquare,
            title: 'restrict',
            clickType: 'restrict'
        },
        removeRestriction: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.ok,
            title: 'removeRestriction',
            clickType: 'removeRestriction'
        },
        openPersonalData: {
            type: ButtonsType.fillTextButton,
            icon: Icons.ok,
            title: 'openPersonalData',
            clickType: 'openPersonalData'
        },
        rewardHistory: {
            type: ButtonsType.headerButton,
            icon: Icons.viewIcon,
            title: 'reward.history',
            clickType: 'rewardHistory'
        },
        positionHeader: {
            type: ButtonsType.headerButton,
            icon: Icons.department,
            title: 'position',
            clickType: 'positionHeader'
        },
        selectPerson: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.userSelectedWhite,
            title: 'memoSelectPerson',
            clickType: 'selectPerson'
        },
        findPerson: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.person,
            title: 'findPerson',
            clickType: 'findPerson'
        },
        find: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.search,
            title: 'find',
            clickType: 'find'
        },
        findPersonDelegation: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.person,
            title: 'findPerson',
            clickType: 'openAssignmentDuties'
        },
        deleteDelegateTableButton: {
            type: ButtonsType.iconButton,
            icon: Icons.delete,
            title: 'requirementModal.removeCondition',
            clickType: 'deleteDutyPerson'
        },
        selectBase: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.orderDocument,
            title: 'selectBase',
            clickType: 'selectBase'
        },
        findSchk: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.person,
            title: 'findSCHK',
            clickType: 'findSchk'
        },
        deletePerson: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.userRemove,
            title: 'memoDeletePerson',
            clickType: 'deletePerson'
        },
        addFromThisGO: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.userSelected,
            title: 'addFromThisGO',
            clickType: 'addFromThisGO'
        },
        addFromAnotherGO: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.usersAdd,
            title: 'addFromAnotherGO',
            clickType: 'addFromAnotherGO'
        },

        clearWhite: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.trash,
            title: 'clear',
            clickType: 'clearWhite'
        },
        downloadFBS: {
            type: ButtonsType.headerButton,
            icon: Icons.download,
            title: 'downloadFBS',
            clickType: 'downloadFBS'
        },
        downloadHeader: {
            type: ButtonsType.headerButton,
            icon: Icons.download,
            title: 'download',
            clickType: 'download'
        },
        downloadShr: {
            type: ButtonsType.headerButton,
            icon: Icons.download,
            title: 'downloadShr',
            clickType: 'downloadShr'
        },
        menuButton: {
            type: ButtonsType.headerButton,
            icon: Icons.delete,
            title: 'menu',
            clickType: 'menuButton'
        },
        searchWhite: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.search,
            title: 'justSearch',
            clickType: 'searchWhite'
        },
        clearFill: {
            type: ButtonsType.fillButton,
            icon: Icons.trash,
            title: 'clear',
            clickType: 'clearFill'
        },
        requestToVIS: {
            type:ButtonsType.borderButton,
            icon: Icons.documentCheck,
            title: 'requestToVIS',
            clickType: 'requestToVIS'
        },
        updateData: {
            type:ButtonsType.borderButton,
            icon: Icons.documentCheck,
            title: 'updateData',
            clickType: 'updateData'
        },
        synchronizeWithAGU: {
            type:ButtonsType.simpleButton,
            icon: Icons.synchronize,
            title: 'synchronizeWithAGU',
            clickType: 'synchronizeWithAGU'
        },
        expandAllSimple: {
            type:ButtonsType.simpleButton,
            icon: Icons.expandAllV2,
            title: 'expandAll',
            clickType: 'expandAllSimple'
        },
        collapseAllSimple: {
            type: ButtonsType.simpleButton,
            icon: Icons.collapseAll,
            title: 'collapseAll',
            clickType: 'collapseAllSimple'
        },
        takeIntoWork: {
            type: ButtonsType.borderButton,
            icon: Icons.editFile,
            title: 'TakeIntoWork',
            clickType: 'takeIntoWork'
        },
        sendForExecution: {
            type: ButtonsType.fillButton,
            icon: Icons.ok,
            title: 'sendForExecution',
            clickType: 'sendForExecution'
        },
        downloadPlan: {
            type: ButtonsType.headerButton,
            icon: Icons.print,
            title: 'downloadPlan',
            clickType: 'downloadPlan'
        },
        viewMidRkLetter: {
            type: ButtonsType.headerButton,
            icon: Icons.eye,
            title: 'viewMidRkLetter',
            clickType: 'viewMidRkLetter'
        },
        addEvent: {
            type: ButtonsType.simpleButton,
            icon: Icons.addDictionaries,
            title: 'addEvent',
            clickType: 'addEvent'
        },
        createNewShr: {
            type: ButtonsType.simpleButton,
            icon: Icons.addDictionaries,
            title: 'createNewShr',
            clickType: 'createNewShr'
        },
        deleteEvent: {
            type: ButtonsType.simpleButton,
            icon: Icons.delete,
            title: 'deleteEvent',
            clickType: 'deleteEvent'
        },
        approveAction: {
            type: ButtonsType.fillButton,
            icon: Icons.ok,
            title: 'approveAction',
            clickType: 'approveAction'
        },
        addCondition: {
            type: ButtonsType.fillButton,
            icon: Icons.add,
            title: 'requirementModal.addCondition',
            clickType: 'openBusinessTripCondition'
        },
        addCondForGroup: {
            type: ButtonsType.simpleButton,
            icon: Icons.add,
            title: 'requirementModal.addCondition',
            clickType: 'addCondition',
            color: 'primary'
        },
        addGroup: {
            type: ButtonsType.fillBorderButton,
            icon: Icons.add,
            title: 'requirementModal.addGroup',
            clickType: 'addGroup',
            color: 'primary'
        },
        addEduCondition: {
            type: ButtonsType.fillBorderButton,
            icon: Icons.add,
            title: 'requirementModal.addEducation',
            clickType: 'addGroup',
            color: 'primary'
        },
        chooseFromPlan : {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.menu,
            title: 'chooseFromPlan',
            clickType: 'chooseFromPlan'
        },
        editCondition: {
            type: ButtonsType.simpleButton,
            icon: Icons.edit,
            title: 'requirementModal.editCondition',
            clickType: 'editBusinessTripCondition'
        },
        editConditionTableButton: {
            type: ButtonsType.iconButton,
            icon: Icons.edit,
            title: 'requirementModal.editCondition',
            clickType: 'editBusinessTripCondition'
        },
        sortDesc: {
            type: ButtonsType.iconButton,
            icon: Icons.sortDesc,
            title: '',
            clickType: 'sortDesc'
        },
        sortAsc: {
            type: ButtonsType.iconButton,
            icon: Icons.sortAsc,
            title: '',
            clickType: 'sortAsc'
        },
        deleteCondition: {
            type: ButtonsType.simpleButton,
            icon: Icons.delete,
            title: 'requirementModal.removeCondition',
            clickType: 'deleteBusinessTripCondition'
        },
        deleteConditionTableButton: {
            type: ButtonsType.iconButton,
            icon: Icons.delete,
            title: 'requirementModal.removeCondition',
            clickType: 'deleteBusinessTripCondition'
        },
        addPerson: {
            type: ButtonsType.simpleButton,
            icon: Icons.person,
            title: 'memoSelectPerson',
            clickType: 'openSearchPerson'
        },
        removePerson: {
            type: ButtonsType.simpleButton,
            icon: Icons.userRemove,
            title: 'memoDeletePerson',
            clickType: 'deletePersonBusinessTrip'
        },
        removePersonTableButton: {
            type: ButtonsType.iconButton,
            icon: Icons.userRemove,
            title: 'memoDeletePerson',
            clickType: 'deletePersonBusinessTrip'
        },
        forPosition: {
            type: ButtonsType.simpleButton,
            icon: Icons.position,
            title: 'toPosition',
            clickType: 'forPosition'
        },
        mentor: {
            type: ButtonsType.simpleButton,
            icon: Icons.userSquare,
            title: 'mentor',
            clickType: 'mentor'
        },
        showStatusShr: {
            type: ButtonsType.simpleButton,
            icon: Icons.position,
            title: 'accordingStaffSchedule',
            clickType: 'showStatusShr'
        },
        check: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.search,
            title: 'check',
            clickType: 'check'
        },
        checkTravelRestriction: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.ok,
            title: 'checkTravelRestriction',
            clickType: 'checkTravelRestriction'
        },
        checkReportDebt: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.ok,
            title: 'checkReportDebt',
            clickType: 'checkReportDebt'
        },
        select: {
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.ok,
            title: 'select',
            clickType: 'select',
        },
        selectFill: {
            type: ButtonsType.fillButton,
            icon: Icons.ok,
            title: 'select',
            clickType: 'selectFill',
        },
        controlledBy: {
            type: ButtonsType.simpleButton,
            icon: Icons.userSquare,
            title: 'controlledBy',
            clickType: 'controlledBy'
        },
        openRDV: {
            type: ButtonsType.simpleButton,
            icon: Icons.attach,
            title: 'selectOrderRDV',
            clickType: 'openRDV'
        },
        reviewed: {
            type: ButtonsType.fillButton,
            icon: Icons.ok,
            title: 'reviewed',
            clickType: 'reviewed'
        },
        revokeTask: {
            type: ButtonsType.headerButton,
            icon: Icons.revokeTask,
            title: 'revoke',
            clickType: 'revokeTask'
        },
        viewInterface: {
            type: ButtonsType.headerButton,
            icon: Icons.viewInterface,
            title: 'interFile',
            clickType: 'viewInterface'
        },
        copyFill: {
            type: ButtonsType.fillButton,
            icon: Icons.template,
            title: 'copy',
            clickType: 'copyFill'
        },
        delegateTo: {
            type: ButtonsType.simpleButton,
            icon: Icons.position,
            title: 'delegateTo',
            clickType: 'delegateTo'
        },
        deleteSchedule: {
            type: ButtonsType.headerButton,
            icon: Icons.trash,
            title: 'deleteSchedule',
            clickType: 'deleteSchedule'
        },
        actualData: {
            type: ButtonsType.headerButton,
            icon: Icons.documentCheck,
            title: 'actualizaData',
            clickType: 'actualData'
        },
        staffScheduleLabel: {
            type: ButtonsType.whiteTextButton,
            icon: '',
            title: 'accordingToStaffSchedule',
            clickType: 'staffScheduleLabel'
        },
        editRow: {
            type: ButtonsType.iconButton,
            icon: Icons.save,
            iconSize: 16,
            title: 'cancelEditing',
            clickType: 'editRow'
        },
        cancelEditRow: {
            type: ButtonsType.iconButton,
            icon: Icons.closeSquare,
            iconSize: 16,
            title: 'cancelEditing',
            clickType: 'cancelEditRow'
        },
        deleteGovernmentAgencyPlan: {
            type: ButtonsType.simpleButton,
            icon: Icons.attach,
            iconSize: 16,
            title: 'deletePlan',
            clickType: 'deleteGovernmentAgencyPlan'
        },
        autoAddApprovedGovernmentAgencyPlans: {
            type: ButtonsType.simpleButton,
            icon: Icons.attach,
            iconSize: 16,
            title: 'autoAddApprovedGovernmentAgencyPlans',
            clickType: 'autoAddApprovedGovernmentAgencyPlans'
        },
        addGovernmentAgencyPlan: {
            type: ButtonsType.simpleButton,
            icon: Icons.attach,
            iconSize: 16,
            title: 'addPlan',
            clickType: 'addGovernmentAgencyPlan'
        },
        downloadUnifiedPlan: {
            type: ButtonsType.headerButton,
            icon: Icons.download,
            iconSize: 16,
            title: 'downloadUnifiedPlan',
            clickType: 'downloadUnifiedPlan'
        },
        sendForAdditionalApproval: {
            type: ButtonsType.simpleButton,
            icon: Icons.compare,
            title: 'toSendForAdditionalApproval',
            clickType: 'sendForAdditionalApproval'
        },
        showOrder: {
            type: ButtonsType.simpleButton,
            icon: Icons.viewIcon,
            iconSize: 16,
            title: 'showOrder',
            clickType: 'showOrder'
        },
        instruction: {
            type: ButtonsType.headerButton,
            icon: Icons.info,
            iconSize: 16,
            title: 'instruction',
            clickType: 'instruction'
        },
        markToActivate: {
            type: ButtonsType.iconButton,
            icon: Icons.aapprove_dash,
            iconSize: 16,
            title: 'markToActivate',
            clickType: 'markToActivateDeactivateApplication'
        },
        addConditionRoute: {
            type: ButtonsType.simpleButton,
            icon: Icons.mapPoint,
            iconSize: 16,
            title: 'addRoute',
            clickType: 'addConditionRoute'
        },
        generateList: {
            type: ButtonsType.simpleButton,
            icon: Icons.list,
            title: 'generateList',
            clickType: 'generateList'
        },
        openVacationListModal: {
            type: ButtonsType.simpleButton,
            icon: Icons.orderDocument,
            title: 'selectVacationOrder',
            clickType: 'openVacationListModal'
        },
        openSickLeaveListModal: {
            type: ButtonsType.simpleButton,
            icon: Icons.orderDocument,
            title: 'selectVacationOrder',
            clickType: 'openSickLeaveListModal'
        },
        addFromCurrentOrg: {
            type: ButtonsType.simpleButton,
            icon: Icons.orderDocument,
            title: 'btns.document',
            clickType: 'addFromCurrentOrg'
        },
        addFromOtherOrg: {
            type: ButtonsType.simpleButton,
            icon: Icons.orderDocument,
            title: 'btns.document',
            clickType: 'addFromOtherOrg'
        },
        sendToHeadGO: {
            type: ButtonsType.headerButton,
            icon: Icons.send,
            title: 'sendToHeadGO',
            clickType: 'sendToHeadGO'
        },
        sendForParameterInput: {
            type: ButtonsType.headerButton,
            icon: Icons.send,
            title: 'sendForParameterInput',
            clickType: 'sendForParameterInput'
        },
        sendForExecutionHeaderButton: {
            type: ButtonsType.headerButton,
            icon: Icons.ok,
            title: 'sendForExecution',
            clickType: 'sendForExecutionHeaderButton'
        },
        contactPerson:{
            type: ButtonsType.whiteSimpleButton,
            icon: Icons.cases,
            title: 'monitoring.contactPerson',
            clickType: 'contactPerson'
        }
    }
}

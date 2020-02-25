import { Component, OnInit } from '@angular/core';
import {
    BrandAdminService,
    DioBrand,
    DioProduct, FormFieldType,
    ProductAdminService
} from '@bizaoss/deepthought-admin-angular-client';

import { ActivatedRoute, Router } from '@angular/router';
import { ProductBasicDetailsFormService } from '@app/core/services/product-forms/product-basic-details-form.service';
import { ProductCardArtsFormService } from '@app/core/services/product-forms/product-card-arts-form.service';
import { ProductFeatureFormCreatorService } from '@app/core/services/product-forms/product-feature-form-creator.service';
import { ProductEligibilitysFormService } from '@app/core/services/product-forms/product-eligibilitys-form.service';
import { ProductConstraintFormService } from '@app/core/services/product-forms/product-constraint-form.service';
import { forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BreadcrumbService } from '@app/layout/breadcrumb.service';
import { CdrFormArray, CdrFormGroup } from '@app/shared/forms/crd-form-group.class';
import { ProductRateTierFormCreatorService } from '@app/core/services/product-forms/product-rate-tier-form-creator.service';
import { ProductLendingRateFormCreatorService } from '@app/core/services/product-forms/product-lending-rate-form-creator.service';
import { ProductDepositRateFormCreatorService } from '@app/core/services/product-forms/product-deposit-rate-form-creator.service';
import { ProductFeeFormCreatorService } from '@app/core/services/product-forms/product-fee-form-creator.service';
import { TypeManagementService } from '@app/core/services/type-management.service';
import { ProductFeeDiscountCreateEditComponent } from '../product-view/product-view-fees/product-fee-discount-create-edit/product-fee-discount-create-edit.component';
import { DialogService } from 'primeng/api';
import { CdrFormControl, CdrFormInput } from '@app/shared/forms/cdr-form-control/cdr-form-control.component';

@Component({
    selector: 'app-product-create-edit-page',
    templateUrl: './product-create-edit-page.component.html',
    styleUrls: ['./product-create-edit-page.component.scss'],
})
export class ProductCreateEditPageComponent implements OnInit {

    BASIC_DETAILS_INDEX = 0;
    CARD_ARTS_INDEX = 1;
    FEATURES_INDEX = 2;
    ELIGIBILITY_CONSTRAINTS_INDEX = 3;
    FEES_INDEX = 4;
    LENDING_RATES_INDEX = 5;
    DEPOSIT_RATES_INDEX = 6;

    isSubmitted = false;

    activeStepIndex = 0;

    steps: Array<{ label: string; }> = [
        { label: 'Basic Information' },
        { label: 'Card Arts' },
        { label: 'Features' },
        { label: 'Eligibility & Constraints' },
        { label: 'Fees' },
        { label: 'Lending Rates' },
        { label: 'Deposit Rates' },
    ];

    msgs = [];

    brandId: string;
    productId: string;

    brand: DioBrand;
    product: DioProduct;

    forms = {
        basicDetails: this.productBasicDetailsForm.createForm(),
        cardArts: [],
        features: [],
        eligibilitys: [],
        constraints: [],
        fees: [],
        lendingRates: [],
        depositRates: [],
    };

    discountDetailsOptions: Array<{ key: string; label: string; }> = [
        { key: 'discountType', label: 'Discount type' },
        { key: 'description', label: 'Description' },
        { key: 'amount', label: 'Amount' },
        { key: 'balanceRate', label: 'Balance rate' },
        { key: 'transactionRate', label: 'Transaction rate' },
        { key: 'accruedRate', label: 'Accrued rate' },
        { key: 'feeRate', label: 'Fee rate' },
        { key: 'additionalValue', label: 'Additional value' },
        { key: 'additionalInfo', label: 'Additional info' },
        { key: 'additionalInfoUri', label: 'Additional info URI' },
    ];

    get isNew() { return !this.productId; }

    constructor(
        private productBasicDetailsForm: ProductBasicDetailsFormService,
        private productCardArtsForm: ProductCardArtsFormService,
        private productFeatureFormCreator: ProductFeatureFormCreatorService,
        private productConstraintFormCreator: ProductConstraintFormService,
        private productEligibilitysFormCreator: ProductEligibilitysFormService,
        private productFeeFormCreator: ProductFeeFormCreatorService,
        private productLendingRateFormCreator: ProductLendingRateFormCreatorService,
        private productDepositRateFormCreator: ProductDepositRateFormCreatorService,
        private productRateTierFormCreator: ProductRateTierFormCreatorService,
        private route: ActivatedRoute,
        private router: Router,
        private brandsApi: BrandAdminService,
        private productsApi: ProductAdminService,
        private breadcrumbService: BreadcrumbService,
        private typeManager: TypeManagementService,
        private dialogService: DialogService,
    ) { }

    ngOnInit() {

        const params = this.route.snapshot.paramMap;

        this.brandId = params.get('brandId');
        this.productId = params.get('productId');

        this.brandsApi.getBrand(this.brandId)
            .pipe(
                map((brand) => this.brand = brand),
                switchMap(() => !!this.productId
                    ? this.productsApi.getProduct(this.brandId, this.productId).pipe(
                        map((product) => this.product = product))
                    : of(0)
                ),
            )
            .subscribe(() => {
                const breadcrumbItems = [
                    { label: 'Brands', routerLink: ['/brands'] },
                    { label: this.brand.name, routerLink: ['/brands', this.brand.id] },
                    { label: 'Products', routerLink: ['/brands', this.brand.id, 'products'] },
                ];

                if (!this.product) {
                    breadcrumbItems.push({ label: 'Create', routerLink: ['/brands', this.brand.id, 'products', 'create'] });
                } else {
                    breadcrumbItems.push({ label: this.product.name, routerLink: ['/brands', this.brand.id, 'products', this.product.id] });
                    breadcrumbItems.push({ label: 'Edit', routerLink: ['/brands', this.brand.id, 'products', this.product.id, 'Edit'] });
                }

                this.breadcrumbService.setItems(breadcrumbItems);
            });

        // TODO: fetch product data --> fillForm
    }

    getDiscountType(type) {
        return this.typeManager.getLabel(FormFieldType.BANKINGPRODUCTDISCOUNTTYPE, type);
    }
    getDiscountEligibilityType(type) {
        return this.typeManager.getLabel(FormFieldType.BANKINGPRODUCTDISCOUNTELIGIBILITYTYPE, type);
    }

    addCardArt() {
        this.forms.cardArts.push(this.productCardArtsForm.createForm());
    }
    addFeature() {
        this.forms.features.push(this.productFeatureFormCreator.createForm());
    }
    addConstraint() {
        this.forms.constraints.push(this.productConstraintFormCreator.createForm());
    }
    addEligibility() {
        this.forms.eligibilitys.push(this.productEligibilitysFormCreator.createForm());
    }
    addFee() {
        const feeForm = this.productFeeFormCreator.createForm();
        (feeForm.get('cdrBanking.discounts') as CdrFormArray).isVisible = false;
        this.forms.fees.push(feeForm);
    }
    addLendingRate() {
        const rateForm = this.productLendingRateFormCreator.createForm();
        (rateForm.get('cdrBanking.tiers') as CdrFormArray).isVisible = false;
        this.forms.lendingRates.push(rateForm);
    }
    addDepositRates() {
        const rateForm = this.productDepositRateFormCreator.createForm();
        (rateForm.get('cdrBanking.tiers') as CdrFormArray).isVisible = false;
        this.forms.depositRates.push(rateForm);
    }

    addRateTier(rateForm: CdrFormGroup) {
        (rateForm.get('cdrBanking.tiers') as CdrFormArray).push(this.productRateTierFormCreator.createForm());
    }
    removeRateTier(rateForm: CdrFormGroup, index: number) {
        (rateForm.get('cdrBanking.tiers') as CdrFormArray).removeAt(index);
    }

    createEditFeeDiscount(feeForm: CdrFormGroup, discountForm?: CdrFormGroup) {
        const discount = discountForm ? discountForm.value : null;

        const ref = this.dialogService.open(ProductFeeDiscountCreateEditComponent, {
            header: !discount ? 'Add discount' : 'Edit discount',
            width: '40%',
            style: {
                'overflow-y': 'auto',
                'overflow-x': 'hidden',
                'max-height': '80vh',
                'min-height': '250px'
            },
            data: { discount }
        });

        ref.onClose.subscribe((_discount) => {
            if (!_discount) return;

            const discountsArrayControl = (feeForm.get('cdrBanking.discounts') as CdrFormArray);
            if (!discount) {
                discountsArrayControl.push(this.productFeeFormCreator.createDiscountForm(_discount));
            } else {
                discountsArrayControl.controls = discountsArrayControl.controls.map((_discountForm) => {
                    return _discountForm === discountForm
                        ? this.productFeeFormCreator.createDiscountForm(_discount)
                        : _discountForm;
                });
            }
        });
    }
    removeFeeDiscount(feeForm: CdrFormGroup, discountIndex: number) {
        (feeForm.get('cdrBanking.discounts') as CdrFormArray).removeAt(discountIndex);
    }

    trackByFn(index, item) {
        return index;
    }

    goBack() {
        !this.productId
            ? this.router.navigate(['/brands', this.brandId, 'products'])
            : this.router.navigate(['/brands', this.brandId, 'products', this.productId]);
    }
    prevStep() {
        if (this.activeStepIndex === 0) {
            return;
        }

        this.activeStepIndex = this.activeStepIndex - 1;
    }
    nextStep() {
        if (this.activeStepIndex === this.steps.length - 1) {
            return;
        }

        this.activeStepIndex = this.activeStepIndex + 1;
    }
    onSave() {
        this.isSubmitted = true;

        if (this.forms.basicDetails.invalid) {
            return;
        }

        const savingProduct$ = this.product
            ? this.productsApi.updateProduct(this.brandId, this.product.id, this.forms.basicDetails.value)
            : this.productsApi.createProduct(this.brandId, this.forms.basicDetails.value);

        savingProduct$
            .pipe(
                switchMap((product) => {
                    this.product = product;

                    const observables = [];

                    // SAVE CARD ARTS **************************************************************************************
                    for (const cardAtrForm of this.forms.cardArts) {
                        const cardArtIdControl = cardAtrForm.get('id') as CdrFormInput;
                        const saving$ = cardArtIdControl.value
                            ? this.productsApi.updateProductCardArt(this.brandId, product.id, cardArtIdControl.value, cardAtrForm.value)
                            : this.productsApi.createProductCardArt(this.brandId, product.id, cardAtrForm.value)
                        ;

                        observables.push(saving$.pipe(
                            map((cardArt) => cardArtIdControl.setValue(cardArt.id)),
                            catchError((errors) => {
                                cardAtrForm.setServerErrors(errors);
                                return throwError(errors);
                            })
                        ));
                    }

                    // FEATURES ********************************************************************************************
                    for (const featureForm of this.forms.features) {
                        const featureIdControl = featureForm.get('id') as CdrFormInput;
                        const saving$ = featureIdControl.value
                            ? this.productsApi.updateProductFeature(this.brandId, product.id, featureIdControl.value, featureForm.value)
                            : this.productsApi.createProductFeature(this.brandId, product.id, featureForm.value)
                        ;

                        observables.push(saving$.pipe(
                            map((feature) => featureIdControl.setValue(feature.id)),
                            catchError((errors) => {
                                featureForm.setServerErrors(errors);
                                return throwError(errors);
                            })
                        ));
                    }

                    // ELIGIBILITYS ****************************************************************************************
                    for (const eligibilityForm of this.forms.eligibilitys) {
                        const eligibilityIdControl = eligibilityForm.get('id') as CdrFormInput;
                        const saving$ = eligibilityIdControl.value
                            ? this.productsApi.updateProductEligibility(this.brandId, product.id, eligibilityIdControl.value, eligibilityForm.value)
                            : this.productsApi.createProductEligibility(this.brandId, product.id, eligibilityForm.value)
                        ;

                        observables.push(saving$.pipe(
                            map((eligibility) => eligibilityIdControl.setValue(eligibility.id)),
                            catchError((errors) => {
                                eligibilityForm.setServerErrors(errors);
                                return throwError(errors);
                            })
                        ));
                    }

                    // CONSTRAINTS *****************************************************************************************
                    for (const constraintForm of this.forms.constraints) {
                        const constraintIdControl = constraintForm.get('id') as CdrFormInput;
                        const saving$ = constraintIdControl.value
                            ? this.productsApi.updateProductConstraint(this.brandId, product.id, constraintIdControl.value, constraintForm.value)
                            : this.productsApi.createProductConstraint(this.brandId, product.id, constraintForm.value)
                        ;

                        observables.push(saving$.pipe(
                            map((constraint) => constraintIdControl.setValue(constraint.id)),
                            catchError((errors) => {
                                constraintForm.setServerErrors(errors);
                                return throwError(errors);
                            })
                        ));
                    }

                    // FEES ************************************************************************************************
                    for (const feeForm of this.forms.fees) {
                        const feeIdControl = feeForm.get('id') as CdrFormInput;
                        const saving$ = feeIdControl.value
                            ? this.productsApi.updateProductFee(this.brandId, product.id, feeIdControl.value, feeForm.value)
                            : this.productsApi.createProductFee(this.brandId, product.id, feeForm.value)
                        ;

                        observables.push(saving$.pipe(
                            map((fee) => feeIdControl.setValue(fee.id)),
                            catchError((errors) => {
                                feeForm.setServerErrors(errors);
                                return throwError(errors);
                            })
                        ));
                    }

                    // LENDING RATES ***************************************************************************************
                    for (const lendingRateForm of this.forms.lendingRates) {
                        const lendingRateIdControl = lendingRateForm.get('id') as CdrFormInput;
                        const saving$ = lendingRateIdControl.value
                            ? this.productsApi.updateProductRateLending(this.brandId, product.id, lendingRateIdControl.value, lendingRateForm.value)
                            : this.productsApi.createProductRateLending(this.brandId, product.id, lendingRateForm.value)
                        ;

                        observables.push(saving$.pipe(
                            map((rate) => lendingRateIdControl.setValue(rate.id)),
                            catchError((errors) => {
                                lendingRateForm.setServerErrors(errors);
                                return throwError(errors);
                            })
                        ));
                    }

                    // DEPOSIT RATES ***************************************************************************************
                    for (const depositRateForm of this.forms.depositRates) {
                        const depositRateIdControl = depositRateForm.get('id') as CdrFormInput;
                        const saving$ = depositRateIdControl.value
                            ? this.productsApi.updateProductRateDeposit(this.brandId, product.id, depositRateIdControl.value, depositRateForm.value)
                            : this.productsApi.createProductRateDeposit(this.brandId, product.id, depositRateForm.value)
                        ;

                        observables.push(saving$.pipe(
                            map((rate) => depositRateIdControl.setValue(rate.id)),
                            catchError((errors) => {
                                depositRateForm.setServerErrors(errors);
                                return throwError(errors);
                            })
                        ));
                    }

                    // RUN REQUESTS ****************************************************************************************

                    return forkJoin(observables);
                })
            )
            .subscribe(
                () => this.goBack(),
                (errors) => {
                    this.activeStepIndex = this.BASIC_DETAILS_INDEX;

                    this.msgs.push({
                        severity: 'error',
                        summary: 'Something wend wrong!',
                        detail: 'Please check form fields data.'
                    });

                    setTimeout(() => {
                        const setErrors = (errors, formsArray: CdrFormGroup[]) => {
                            for (const formGroup of formsArray) {
                                formGroup.setServerErrors(errors);
                            }
                        };

                        setErrors(errors, [this.forms.basicDetails]);
                        setErrors(errors, this.forms.cardArts);
                        setErrors(errors, this.forms.features);
                        setErrors(errors, this.forms.eligibilitys);
                        setErrors(errors, this.forms.constraints);
                        setErrors(errors, this.forms.fees);
                        setErrors(errors, this.forms.lendingRates);
                        setErrors(errors, this.forms.depositRates);
                    });
                }
            );
    }

    getFirstError(control: CdrFormControl): string {
        if (control && control.errors) {
            const errors = Object.keys(control.errors);

            for (const key of errors) {
                switch (key) {
                    case 'required': return `${control.label} is required field`;
                    case 'uuid': return `${control.label} must have UUID format`;
                    case 'SERVER': return control.errors[key];
                }
            }
        }

        return '';
    }

}

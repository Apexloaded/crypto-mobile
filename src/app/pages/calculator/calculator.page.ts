import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CalculatorProps } from 'src/app/interface/calculator-props.interface';
import { PlanService } from 'src/app/services';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage implements OnInit {
  public plans: Array<any> = [];
  public amount: number | undefined;

  public calProps: CalculatorProps;

  constructor(private router: Router, private planProvider: PlanService) {
    this.calProps = {
      earnings: 0,
      percentage: 0,
      investment: '0',
    };
    this.planProvider
      .recordRetrieve()
      .then((res) => {
        this.plans = res?.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  ngOnInit() {}

  public calculate() {
    const plan = this.plans.find(
      (f) =>
        this.amount! >= Number(f.min_amount) &&
        this.amount! <= Number(f.max_amount)
    );
    if (plan) {
      const estimatedEarning = (this.amount! * Number(plan.max_percent)) / 100;
      this.calProps.earnings = estimatedEarning;
      this.calProps.percentage = plan.max_percent;
      this.calProps.duration = plan.package_duration;
      this.calProps.payment_period = plan.payment_period;
    }

    if (!plan) {
      this.reset();
    }
  }

  public reset() {
    if (this.calProps) {
      this.calProps.investment = undefined;
      this.calProps.earnings = 0;
      this.calProps.percentage = 0;
      this.calProps.duration = 'All times';
      this.calProps.payment_period = 'None';
    }
  }
  public back() {
    this.router.navigateByUrl('/home');
  }
}

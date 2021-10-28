import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AcknowledgeGuard } from './_guards/acknowledge.guard';
import { AuthGuard } from './_guards/auth.guards';
import { OnboardGuard } from './_guards/onboard.guard';
import { SellGuard } from './_guards/sell.guard';
import { SignalGuard } from './_guards/signal.guard';
import { SubscriptionGuard } from './_guards/subscription.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'signals',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./signals/signals.module').then(m => m.SignalsPageModule)
  },
  {
    path: 'signal/:id',
    canActivate: [AuthGuard, AcknowledgeGuard, SignalGuard],
    loadChildren: () => import('./signal/signal.module').then(m => m.SignalPageModule)
  },
  {
    path: 'news',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./news/news.module').then(m => m.NewsPageModule)
  },
  {
    path: 'wallet',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./wallet/wallet.module').then(m => m.WalletPageModule)
  },
  {
    path: 'sell',
    canActivate: [AuthGuard, AcknowledgeGuard, SellGuard],
    loadChildren: () => import('./sell/sell.module').then(m => m.SellPageModule)
  },
  {
    path: 'account',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./account/account.module').then(m => m.AccountPageModule)
  },
  {
    path: 'support',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./support/support.module').then(m => m.SupportPageModule)
  },
  {
    path: 'compliance',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./compliance/compliance.module').then(m => m.CompliancePageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then(m => m.PrivacyPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then(m => m.TermsPageModule)
  },
  {
    path: 'subscriptions',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./subscriptions/subscriptions.module').then(m => m.SubscriptionsPageModule)
  },
  {
    path: 'onboard',
    canActivate: [OnboardGuard],
    loadChildren: () => import('./onboard/onboard.module').then(m => m.OnboardPageModule)
  },
  {
    path: 'sell-onboard',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./sell-onboard/sell-onboard.module').then(m => m.SellOnboardPageModule)
  },
  {
    path: 'settings',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule)
  },
  {
    path: 'notifications',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./notifications/notifications.module').then(m => m.NotificationsPageModule)
  },
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationPageModule)
  },
  {
    path: 'profile/:id',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'company/:id',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./company/company.module').then(m => m.CompanyPageModule)
  },
  {
    path: 'buying-advantages',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./buying-advantages/buying-advantages.module').then(m => m.BuyingAdvantagesPageModule)
  },
  {
    path: 'subscription/:id',
    canActivate: [AuthGuard, AcknowledgeGuard, SubscriptionGuard],
    loadChildren: () => import('./subscription/subscription.module').then(m => m.SubscriptionPageModule)
  },
  {
    path: 'home',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'notification-settings',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./notification-settings/notification-settings.module').then(m => m.NotificationSettingsPageModule)
  },
  {
    path: 'warnings',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./warnings/warnings.module').then(m => m.WarningsPageModule)
  },
  {
    path: 'subscription-settings',
    canActivate: [AuthGuard, AcknowledgeGuard, SellGuard],
    loadChildren: () => import('./subscription-settings/subscription-settings.module').then(m => m.SubscriptionSettingsPageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./intro/intro.module').then(m => m.IntroPageModule)
  },
  {
    path: 'sell-onboard',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./sell-onboard/sell-onboard.module').then(m => m.SellOnboardPageModule)
  },
  {
    path: 'sell-advantages',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./sell-advantages/sell-advantages.module').then(m => m.SellAdvantagesPageModule)
  },
  {
    path: 'company-settings',
    canActivate: [AuthGuard, AcknowledgeGuard],
    loadChildren: () => import('./company-settings/company-settings.module').then(m => m.CompanySettingsPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then(m => m.HelpPageModule)
  },
  {
    path: 'help-view',
    loadChildren: () => import('./help-view/help-view.module').then(m => m.HelpViewPageModule)
  },
  {
    path: 'acknowledge',
    canActivate: [AuthGuard],
    loadChildren: () => import('./acknowledge/acknowledge.module').then(m => m.AcknowledgePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

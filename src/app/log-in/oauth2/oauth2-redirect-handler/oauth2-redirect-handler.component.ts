import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-oauth2-redirect-handler',
  templateUrl: './oauth2-redirect-handler.component.html',
  styleUrls: ['./oauth2-redirect-handler.component.scss']
})
export class Oauth2RedirectHandlerComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(query => {
      const authToken = query.authToken;
      const userEmail = query.userEmail;
      const refreshToken = query.refreshToken;
      const rol = query.rol;
      const expiraEn = query.expiraEn;
      const error = query.error;

      if (authToken) {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userEmail', userEmail);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('rol', rol);
        localStorage.setItem('expiraEn', expiraEn);

        this.authService.loggedIn.emit(true);
        this.authService.useremail.emit(userEmail);

        this.toastr.success(`¡Bienvenido ${userEmail}!`);

        this.router.navigate(['home']);
      } else {
        this.router.navigate(['userLogIn']);
        this.toastr.error(error);
      }
    });
  }

}

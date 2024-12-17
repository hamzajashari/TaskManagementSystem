using Xunit;
using Moq;
using TaskSystem.Controllers;
using TaskSystem.Services;
using TaskSystem.ViewModels;
using Microsoft.AspNetCore.Mvc;
using TaskSystem.Utilities;

namespace TaskSystem.Tests.Controllers
{
    public class AccountControllerTests
    {
        private readonly Mock<IAccountService> _mockAccountService;
        private readonly AccountController _controller;

        public AccountControllerTests()
        {
            _mockAccountService = new Mock<IAccountService>();
            _controller = new AccountController(_mockAccountService.Object);
        }

        [Fact]
        public async Task Login_WithValidCredentials_ReturnsOkResult()
        {
            var loginVM = new LoginVM 
            { 
                Email = "test@example.com", 
                Password = "Test@123" 
            };
            var expectedToken = new JwtTokenResponseVM 
            { 
                AccessToken = "test-token",
                RefreshToken = "refresh-token" 
            };

            _mockAccountService.Setup(service => service.LoginAsync(It.IsAny<LoginVM>()))
            .ReturnsAsync(new MethodResult<JwtTokenResponseVM>.Success(expectedToken));

            var result = await _controller.Login(loginVM);


            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnedToken = Assert.IsType<JwtTokenResponseVM>(okResult.Value);
            Assert.Equal(expectedToken.AccessToken, returnedToken.AccessToken);
        }

        [Fact]
        public async Task Register_WithValidData_ReturnsOkResult()
        {
            var registerVM = new RegisterVM 
            { 
                Email = "test@example.com",
                Password = "Test@123",
                ConfirmPassword = "Test@123",
                FullName = "Test User"
            };

            _mockAccountService.Setup(service => service.RegisterAsync(It.IsAny<RegisterVM>()))
            .ReturnsAsync(new MethodResult<RegisterVM>.Success(registerVM));
         
            var result = await _controller.Register(registerVM);

            Assert.IsType<OkObjectResult>(result);
        }
    }
} 
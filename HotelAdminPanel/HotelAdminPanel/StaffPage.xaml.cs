using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace HotelAdminPanel
{
    /// <summary>
    /// Interaction logic for StaffPage.xaml
    /// </summary>
    public partial class StaffPage : Window
    {
        public StaffPage()
        {
            InitializeComponent();
        }

        private void usermg_Click(object sender, RoutedEventArgs e)
        {

            StaffUserManagement staffUserManagement = new StaffUserManagement();
            staffUserManagement.Show();
            Window.GetWindow(this)?.Close();
        }

        private void hotelmg_Click(object sender, RoutedEventArgs e)
        {
            StaffHotelManagement staffHotelManagement = new StaffHotelManagement();
            staffHotelManagement.Show();
            Window.GetWindow(this)?.Close();
        }

        private void datamg_Click(object sender, RoutedEventArgs e)
        {
            StaffDataView staffDataView = new StaffDataView();
            staffDataView.Show();
            Window.GetWindow(this)?.Close();
        }
    }
}

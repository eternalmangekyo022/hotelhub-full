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
    /// Interaction logic for StaffUserManagement.xaml
    /// </summary>
    public partial class StaffUserManagement : Window
    {
        public StaffUserManagement()
        {
            InitializeComponent();
            resetbtn.Visibility = Visibility.Hidden;
            Database database = new Database();
            database.LoadUsersToDataGrid(usersdata);
            LoadSearchColumns();
        }

        private void LoadSearchColumns()
        {
            searchsel.Items.Clear();
            searchsel.Items.Add("firstname");
            searchsel.Items.Add("lastname");
            searchsel.Items.Add("email");
            searchsel.Items.Add("phone");
            searchsel.SelectedIndex = 0;
        }
        private void backbtn_Click(object sender, RoutedEventArgs e)
        {
            usersdata.ItemsSource = null;
            GC.Collect();
            GC.WaitForPendingFinalizers();
            StaffPage staffPage = new StaffPage();
            staffPage.Show();
            Window.GetWindow(this)?.Close();
        }

        private void searchbtn_Click(object sender, RoutedEventArgs e)
        {
            resetbtn.Visibility = Visibility.Visible;
            string selectedColumn = searchsel.Text;
            string searchText = searchbox.Text;

            if (string.IsNullOrWhiteSpace(selectedColumn) || string.IsNullOrWhiteSpace(searchText))
            {
                MessageBox.Show("Please select a column and enter a search term.", "Invalid Input", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            Database database = new Database();
            usersdata.ItemsSource = null;
            database.SearchData("users", selectedColumn, searchText, usersdata);
        }

        private void resetbtn_Click(object sender, RoutedEventArgs e)
        {
            Database database = new Database();
            usersdata.ItemsSource = null;
            searchbox.Text = "";
            database.LoadUsersToDataGrid(usersdata);
        }
    }
}

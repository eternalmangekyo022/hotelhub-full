﻿using System;
using System.Collections.Generic;
using System.Data;
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
using MySql.Data.MySqlClient;

namespace HotelAdminPanel
{
    /// <summary>
    /// Interaction logic for UserManagement.xaml
    /// </summary>
    public partial class UserManagement : Window
    {
        public void resetTextboxes()
        {
            firstname.Text = "";
            lastname.Text = "";
            permission.SelectedIndex = 0;
            phone.Text = "";
            email.Text = "";
            passw.Password = "";
        }
        public UserManagement()
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


        private void adduserbtn_Click(object sender, RoutedEventArgs e)
        {
            Database database = new Database();
            database.ConnectToDatabase();
            if (firstname.Text == "" || lastname.Text == "" || permission.Text == "" || phone.Text == "" || email.Text == "" || passw.Password == "")
            {
                MessageBox.Show("Please fill in the necessary information.", "Empty Fields", MessageBoxButton.OK, MessageBoxImage.Warning);
            }
            else
            {
                database.AddUser(firstname, lastname, permission, phone, email, passw);
                database.LoadUsersToDataGrid(usersdata);
            }
            resetTextboxes();
           
        }

        private void deleteuserbtn_Click(object sender, RoutedEventArgs e)
        {
            if (usersdata.SelectedItem == null)
            {
                MessageBox.Show("Please select a user to delete.", "No Selection", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            DataRowView selectedRow = usersdata.SelectedItem as DataRowView;

            if (selectedRow != null)
            {
                int userId = Convert.ToInt32(selectedRow["id"]);

                MessageBoxResult result = MessageBox.Show("Are you sure you want to delete this user?", "Confirm Deletion", MessageBoxButton.YesNo, MessageBoxImage.Question);

                if (result == MessageBoxResult.Yes)
                {
                    Database database = new Database();
                    database.DeleteUser(userId);

                    database.LoadUsersToDataGrid(usersdata);
                }
            }
            resetTextboxes();

        }

        private void updateuserbtn_Click(object sender, RoutedEventArgs e)
        {
            if (usersdata.SelectedItem == null)
            {
                MessageBox.Show("Please select a user to delete.", "No Selection", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            DataRowView selectedRow = usersdata.SelectedItem as DataRowView;

            if (selectedRow != null)
            {
                int userId = Convert.ToInt32(selectedRow["id"]);

                MessageBoxResult result = MessageBox.Show("Are you sure you want to update this user?",
                                                          "Confirm Update",
                                                          MessageBoxButton.YesNo,
                                                          MessageBoxImage.Question);

                if (result == MessageBoxResult.Yes)
                {
                    Database database = new Database();
                    database.UpdateUser(userId, firstname, lastname, permission, phone, email, passw);

                    database.LoadUsersToDataGrid(usersdata);
                }
            }
            resetTextboxes();

        }

        private void backbtn_Click(object sender, RoutedEventArgs e)
        {
            usersdata.ItemsSource = null;
            GC.Collect();
            GC.WaitForPendingFinalizers();
            AdminPage adminPage = new AdminPage();
            adminPage.Show();
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
            database.SearchUsers(searchText, usersdata);
        }

        private void resetbtn_Click(object sender, RoutedEventArgs e)
        {
            Database database = new Database();
            usersdata.ItemsSource = null;
            searchbox.Text = "";
            database.LoadUsersToDataGrid(usersdata);
        }

        private void usersdata_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            // Check if an item is selected
            if (usersdata.SelectedItem is DataRowView selectedRow)
            {
                // Safely assign values to UI elements
                firstname.Text = selectedRow["firstname"]?.ToString() ?? string.Empty;
                lastname.Text = selectedRow["lastname"]?.ToString() ?? string.Empty;
                phone.Text = selectedRow["phone"]?.ToString() ?? string.Empty;
                email.Text = selectedRow["email"]?.ToString() ?? string.Empty;
            }
            else
            {
                // Clear the fields if no item is selected
                firstname.Text = string.Empty;
                lastname.Text = string.Empty;
                phone.Text = string.Empty;
                email.Text = string.Empty;
            }
        }
    }
}

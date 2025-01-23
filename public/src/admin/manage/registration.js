'use strict';

define('admin/manage/registration', ['bootbox', 'alerts'], function (bootbox, alerts) {
	const Registration = {};

	Registration.init = function () {
		$('.users-list').on('click', '[data-action]', handleUserAction);
		$('.invites-list').on('click', '[data-action]', handleInvitationAction);
	};

	

	// Handle invitation actions
	function handleInvitationAction() {
		const parent = $(this).parents('[data-invitation-mail][data-invited-by]');
		const email = parent.attr('data-invitation-mail');
		const invitedBy = parent.attr('data-invited-by');
		const action = $(this).attr('data-action');

		if (action === 'delete') {
			confirmAndDeleteInvitation(parent, email, invitedBy);
		}

		return false;
	}

	// Confirm and delete an invitation
	function confirmAndDeleteInvitation(parent, email, invitedBy) {
		bootbox.confirm('[[admin/manage/registration:invitations.confirm-delete]]', function (confirm) {
			if (!confirm) return;

			socket.emit('user.deleteInvitation', { email: email, invitedBy: invitedBy }, function (err) {
				if (err) {
					return alerts.error(err);
				}
				removeRow(parent);
			});
		});
	}

	// Remove a row and adjust the UI
	function removeRow(parent) {
		const nextRow = parent.next();
		const thisRowInvitedBy = parent.find('.invited-by');
		const nextRowInvitedBy = nextRow.find('.invited-by');

		if (nextRowInvitedBy.html() !== undefined && nextRowInvitedBy.html().length < 2) {
			nextRowInvitedBy.html(thisRowInvitedBy.html());
		}

		parent.remove();
	}

	return Registration;
});


// used chatgpt to help with helper function ideas
